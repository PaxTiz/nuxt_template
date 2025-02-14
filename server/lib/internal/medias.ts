import { and, eq, sql } from 'drizzle-orm';
import { fileTypeFromBuffer } from 'file-type';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import sharp from 'sharp';
import { __medias } from '~~/server/database';
import { Service } from '../service';

const CACHE_PREFIX = '/__cache__';

type Media = typeof __medias.$inferSelect;
type ImageFormat = 'png' | 'jpeg' | 'webp' | 'avif';
type Modifiers = {
  width?: number;

  height?: number;

  format?: ImageFormat;

  quality?: number;

  blur?: number;
};

type UploadOptions = {
  parentId?: number;

  modifiers?: Modifiers;
};

export class MediasService extends Service {
  private readonly path: string;

  constructor() {
    super();
    this.path = join(process.cwd(), '.storage', 'medias');
  }

  /**
   * Upload a file at given location
   *
   * @param path relative path to be uploaded to
   * @param data file content
   * @param parentId parent media id if trying to upload a cached version of an existing media
   */
  public async upload(path: string, data: Buffer, options?: UploadOptions) {
    if (!path.startsWith('/')) {
      path = join('/', path);
    }

    const extension = options?.modifiers?.format
      ? `.${options.modifiers.format}`
      : extname(path);
    const safeFilename = `${randomUUID()}${extension}`;
    const baseFilename = basename(path);

    const mimeType = await fileTypeFromBuffer(data);
    const metadata = await sharp(data)
      .metadata()
      .catch(() => null);

    await mkdir(this.toAbsolutePath(dirname(path)), { recursive: true });

    const relativeDiskPath = path.replace(baseFilename, safeFilename);
    const diskPath = this.toAbsolutePath(relativeDiskPath);
    const publicPath = path.startsWith(CACHE_PREFIX)
      ? path.replace(CACHE_PREFIX, '')
      : path;

    await Promise.all([
      writeFile(diskPath, data),
      this.database.insert(__medias).values({
        filename: safeFilename,
        originalFilename: baseFilename,
        diskPath: relativeDiskPath,
        width: metadata?.width,
        height: metadata?.height,
        mimeType: mimeType?.mime,
        parentId: options?.parentId,
        modifiersKey: this.toCacheKey(options?.modifiers),
        publicPath,
      }),
    ]);
  }

  /**
   * Download a file and apply modifiers if possible
   *
   * @param path relative path of the file
   * @param modifiers transformations to apply if it's an image
   * @returns file as a `Buffer` or `null` if not found
   */
  public async download(
    path: string,
    modifiers?: Modifiers,
  ): Promise<Buffer | null> {
    path = join('/', path);

    const isImage = this.isImage(path);
    const modifiersKey = this.toCacheKey(modifiers);

    const media = await this.findFileFromDatabase(path, modifiersKey);
    if ((!media && !isImage) || (!media && !modifiersKey)) {
      return null;
    }

    const basePath = media?.diskPath ?? path;
    const realPath = this.toAbsolutePath(basePath);

    try {
      const file = await readFile(realPath);
      if (!modifiersKey || media?.modifiersKey) {
        return file;
      }

      let sharpBuffer = sharp(file);
      if (modifiers?.width || modifiers?.height) {
        sharpBuffer = sharpBuffer.resize(
          modifiers.width ?? null,
          modifiers.height ?? null,
        );
      }

      if (modifiers?.format) {
        sharpBuffer = sharpBuffer.toFormat(modifiers.format, {
          quality: modifiers?.quality ?? 100,
        });
      }

      if (modifiers?.blur) {
        sharpBuffer = sharpBuffer.blur(modifiers.blur);
      }

      const buffer = await sharpBuffer.toBuffer();
      await this.upload(join(CACHE_PREFIX, media?.publicPath ?? path), buffer, {
        parentId: media?.id,
        modifiers,
      });

      return buffer;
    } catch (e) {
      console.error(`[medias][get] failed to read file: ${path}`, e);
      return null;
    }
  }

  /**
   * Delete a file and it's children
   *
   * @param id id of a file
   */
  public async delete(id: number) {
    const files = await this.database.query.__medias.findFirst({
      where: eq(__medias.id, id),
      with: { children: true },
    });

    if (!files) {
      return;
    }

    await Promise.all([
      rm(this.toAbsolutePath(files.diskPath)),
      ...files.children.map((file) => rm(this.toAbsolutePath(file.diskPath))),
    ]);

    await this.database.delete(__medias).where(eq(__medias.id, files.id));
  }

  /**
   * Create an absolute path from the relative one
   *
   * @param path relative path
   * @returns absolute path starting from `/`
   */
  private toAbsolutePath(relative: string): string {
    return join(this.path, relative);
  }

  /**
   * Transforms the modifiers to a string that can be used as a key
   *
   * @param modifiers transformations to apply if it's an image
   * @returns a string representing a key for all the given modifiers
   */
  private toCacheKey(modifiers?: Modifiers): string | null {
    if (!modifiers) {
      return null;
    }

    const key = [];
    if (modifiers?.width) {
      key.push(`w_${modifiers.width}`);
    }
    if (modifiers?.height) {
      key.push(`h_${modifiers.height}`);
    }
    if (modifiers?.quality) {
      key.push(`q_${modifiers.quality}`);
    }
    if (modifiers?.format) {
      key.push(`f_${modifiers.format}`);
    }

    return key.join('-');
  }

  /**
   * Check if the path extension is an image
   *
   * @param path path or filename
   * @returns path extension is an image
   */
  private isImage(path: string): boolean {
    const extension = extname(path);
    return ['.png', '.jpg', '.jpeg', '.webp', '.avif'].includes(extension);
  }

  /**
   * Find a media from the database by `publicPath` and `modifiersKey`,
   * or fallback only to `publicPath` if not found
   *
   * @param path public path of the file trying to access
   * @param modifiersKey a key that stringify the modifiers
   * @returns a media row from the database, or null
   */
  private async findFileFromDatabase(
    path: string,
    modifiersKey: string | null,
  ): Promise<Media | null> {
    console.log({ path, modifiersKey });

    let file: Array<Media> | null = null;
    if (modifiersKey) {
      const queryWithoutModifiers = this.database
        .select({ id: __medias.id })
        .from(__medias)
        .where(eq(__medias.publicPath, path))
        .limit(1);

      const queryWithModifiers = this.database
        .select({ id: __medias.id })
        .from(__medias)
        .where(
          and(
            eq(__medias.publicPath, path),
            eq(__medias.modifiersKey, modifiersKey),
          ),
        )
        .limit(1);

      const subquery = sql`(SELECT IFNULL(${queryWithModifiers}, ${queryWithoutModifiers}))`;

      file = await this.database
        .select()
        .from(__medias)
        .where(eq(__medias.id, subquery))
        .limit(1);
    } else {
      file = await this.database
        .select()
        .from(__medias)
        .where(eq(__medias.publicPath, path))
        .limit(1);
    }

    return file && file.length === 1 ? file[0] : null;
  }
}
