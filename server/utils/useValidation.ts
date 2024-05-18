import { H3Event, type MultiPartData } from 'h3';
import { ZodSchema, z } from 'zod';

type FormError =
  | { key: string; message: string }
  | Array<{ key: string; message: string }>;

type InputFile = Record<
  string,
  {
    mimeTypes?: string | Array<string>;
    size?: number;
    required: boolean;
  }
>;

type RequestFiles<F extends InputFile> = {
  [K in keyof F]: F[K]['required'] extends true
    ? MultiPartData
    : MultiPartData | undefined;
};

type ValidateOptionsInput = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  files?: InputFile;
};

type ValidateOptionsOutput<T extends ValidateOptionsInput> = {
  [K in keyof T as NonNullable<T[K]> extends undefined
    ? never
    : K]: T[K] extends ZodSchema
    ? NonNullable<z.infer<T[K]>>
    : T[K] extends InputFile
      ? NonNullable<RequestFiles<T[K]>>
      : NonNullable<T[K]>;
};

const asyncReduce = async <T, U>(
  array: Array<T>,
  asyncCallback: (
    accumulator: U,
    currentValue: T,
    index: number,
    array: Array<T>,
  ) => Promise<U>,
  initialValue: U,
): Promise<U> => {
  let accumulator = initialValue;

  for (let i = 0; i < array.length; i++) {
    accumulator = await asyncCallback(accumulator, array[i], i, array);
  }

  return accumulator;
};

const parseValue = (value: unknown, schema: ZodSchema) => {
  const response = schema.safeParse(value);
  if (response.success) {
    return response.data as z.infer<typeof schema>;
  } else {
    throw createError({ statusCode: 400, data: response.error.errors });
  }
};

export const useValidation = async <
  T extends ValidateOptionsInput,
  F extends InputFile,
>(
  event: H3Event,
  options: T,
): Promise<ValidateOptionsOutput<T>> => {
  return (await asyncReduce(
    Object.entries(options),
    async (acc, [key, schema]) => {
      if (schema && schema instanceof ZodSchema) {
        if (key === 'body') {
          const body = await readBody(event);
          return {
            ...acc,
            body: parseValue(body, schema),
          };
        }

        if (key === 'query') {
          const query = getQuery(event);
          return {
            ...acc,
            query: parseValue(query, schema),
          };
        }

        if (key === 'params') {
          const params = event.context.params;
          return {
            ...acc,
            params: parseValue(params, schema),
          };
        }
      } else if (schema) {
        const body = await readMultipartFormData(event);

        const errors: FormError = [];
        const requestFiles = {} as RequestFiles<F>;
        for (const [key, file] of Object.entries(options.files ?? {})) {
          const bodyFile = body?.find((e) => e.name === key);
          if (file.required && !bodyFile) {
            errors.push({ key: `file_${key}`, message: `${key}_missing_file` });
            continue;
          }

          if (bodyFile) {
            if (
              file.size &&
              Buffer.byteLength(bodyFile.data) > file.size * 1024 * 1024
            ) {
              errors.push({
                key: `file_${key}`,
                message: `${key}_file_too_big`,
              });
              continue;
            }

            if (file.mimeTypes) {
              if (!bodyFile.type) {
                errors.push({
                  key: `file_${key}`,
                  message: 'invalid_mime_type',
                });
                continue;
              }

              const types = Array.isArray(file.mimeTypes)
                ? file.mimeTypes
                : [file.mimeTypes];
              if (!types.includes(bodyFile.type)) {
                errors.push({
                  key: `file_${key}`,
                  message: 'invalid_mime_type',
                });
                continue;
              }
            }
          }

          requestFiles[key as keyof F] =
            bodyFile as F[keyof F]['required'] extends true
              ? MultiPartData
              : MultiPartData | undefined;
        }

        if (errors.length > 0) {
          throw createFormError(errors);
        }

        return { ...acc, files: requestFiles };
      }

      return acc;
    },
    {},
  )) as ValidateOptionsOutput<T>;
};

export const createFormError = (error: FormError) => {
  const errors: Array<FormError> = Array.isArray(error) ? error : [error];
  throw createError({ statusCode: 422, data: errors });
};
