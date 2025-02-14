<script lang="ts" setup>
import {
  mimeTypes as allMimeTypes,
  toBase64,
  isImageMimeType,
} from '~/utils/shared/files';

type FileWithPreview = { file: File; preview?: string };

const {
  label = "Cliquez pour sélectionner un fichier ou déposez le dans l'encadré",
  multiple = false,
  mimeTypes = allMimeTypes.image,
} = defineProps<{
  label?: string;
  multiple?: boolean;
  mimeTypes?: Array<string>;
}>();

const emit = defineEmits<{
  (e: 'select', files: Array<File>): void;
}>();

const selectedFiles = ref<Array<FileWithPreview>>([]);
const dropzoneRef = useTemplateRef<HTMLDivElement>('dropzoneRef');
const manualFilesRef = useTemplateRef<HTMLDivElement>('manualFilesRef');

const onFilesSelected = async (files: Array<File> | null) => {
  const newFiles: Array<FileWithPreview> = (
    files ? (multiple ? files : [files[0]]) : []
  ).map((f) => ({ file: f }));

  const allFiles = multiple ? [...selectedFiles.value, ...newFiles] : newFiles;
  emit(
    'select',
    allFiles.map((file) => file.file),
  );

  for (const file of allFiles) {
    if (!file.preview && isImageMimeType(file.file.type)) {
      file.preview = await toBase64(file.file);
    } else if (!file.preview) {
      // TODO: Add icon for file type
    }
  }

  selectedFiles.value = allFiles;
};

const onManualFilesSelected = (event: Event) => {
  const files = (event.target as HTMLInputElement)?.files ?? [];
  const realFiles = Array.from(files);
  onFilesSelected(realFiles);
};

const onFileDeleted = (file: File) => {
  const newFiles = selectedFiles.value.filter((e) => e.file !== file);
  emit(
    'select',
    newFiles.map((f) => f.file),
  );
  selectedFiles.value = newFiles;
};

const { isOverDropZone } = useDropZone(dropzoneRef, {
  onDrop: onFilesSelected,
  dataTypes: mimeTypes,
});
</script>

<template>
  <div class="dropzone__container">
    <input
      ref="manualFilesRef"
      class="hidden"
      type="file"
      :multiple="multiple"
      :accept="mimeTypes.join(',')"
      @change="onManualFilesSelected"
    />

    <div
      ref="dropzoneRef"
      class="dropzone"
      :class="{ dropzone__hover: isOverDropZone }"
      @click="() => manualFilesRef?.click()"
    >
      <span class="dropzone__label">{{ label }}</span>
    </div>

    <div class="dropzone__preview">
      <div
        v-for="(file, index) in selectedFiles"
        :key="`${index}-${file.file.name}`"
        class="dropzone__preview-item"
        v-tooltip.bottom="'Cliquez pour supprimer'"
        @click="() => onFileDeleted(file.file)"
      >
        <div class="flex-1">
          <img
            :src="file.preview"
            :alt="`Prévisualisation du fichier ${file.file.name}`"
          />
        </div>

        <p>
          {{ file.file.name.slice(0, 15) }}
          {{ file.file.name.length > 15 ? '...' : '' }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropzone {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: theme('borderRadius.DEFAULT');
  border: 1px dashed theme('borderColor.gray.400');
  padding: 2rem;
  cursor: pointer;
}
.dropzone__hover {
  border-color: theme('borderColor.primary');
  background-color: theme('backgroundColor.blue.50');
}
.dropzone__label {
  color: theme('colors.gray.400');
}

.dropzone__preview {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.dropzone__preview-item {
  display: flex;
  flex-direction: column;
  width: 150px;
  border: 1px solid theme('borderColor.gray.400');
  border-radius: theme('borderRadius.DEFAULT');
}
.dropzone__preview-item:hover {
  border-color: theme('borderColor.red.400');
  background-color: theme('backgroundColor.red.50');
  cursor: pointer;
}
.dropzone__preview-item > div:first-child {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 148px;
  height: 150px;
}
.dropzone__preview-item img {
  display: block;
  width: 100%;
  max-width: 148px;
  max-height: 148px;
  border-radius: theme('borderRadius.DEFAULT');
  object-fit: cover;
}
.dropzone__preview-item p {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 0.8rem;
  background-color: theme('borderColor.gray.200');
  padding: 8px;
  margin: 0;
  border-top: 1px solid theme('borderColor.gray.400');
  border-bottom-left-radius: theme('borderRadius.DEFAULT');
  border-bottom-right-radius: theme('borderRadius.DEFAULT');
}
</style>
