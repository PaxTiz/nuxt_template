<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions';
import { toBase64 } from '~/utils/shared/files';

const toast = useToast();
const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef');

const inputRef = ref<HTMLInputElement>();
const outsideLink = ref();
const file = ref<{ src?: string; title?: string; alt?: string }>({
  src: undefined,
  title: undefined,
  alt: undefined,
});

const onUrlChange = async () => {
  if (outsideLink.value && outsideLink.value.length > 0) {
    const response = await fetch(outsideLink.value);
    if (response.status > 400) {
      toast.add({
        severity: 'error',
        summary: 'Le lien semble être invalide',
        detail: `Le fichier renvoie une erreur ${response.status}`,
        life: 3000,
      });

      file.value.src = undefined;
    } else {
      file.value.src = outsideLink.value;
    }
  }
};

const onSelectFile = () => {
  inputRef.value?.click();
};

const onFileSelected = async (event: Event) => {
  const files = (event.target as HTMLInputElement)?.files;
  if (!files) {
    return;
  }

  const singleFile = files[0];
  const base64 = await toBase64(singleFile);
  file.value = {
    src: base64,
    title: singleFile.name,
    alt: singleFile.name,
  };
  outsideLink.value = undefined;
};

const onCloseDialog = <T,>(data: T) => {
  dialogRef?.value?.close(data);
};
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <input ref="inputRef" type="file" class="hidden" @change="onFileSelected" />

    <InputText
      v-model="outsideLink"
      placeholder="Entrez une URL"
      @change="onUrlChange"
    />
    <Divider layout="vertical">
      <b>OU</b>
    </Divider>

    <Button
      label="Choisir un fichier"
      severity="secondary"
      outlined
      @click="onSelectFile"
    />
  </div>

  <div
    v-if="file.src"
    class="p-2 border border-gray-200 border-solid rounded mt-4 w-fit"
  >
    <img
      :src="file.src"
      class="block object-cover w-full max-w-[200px] rounded"
      alt=""
    />
  </div>

  <div class="flex justify-end gap-4 w-full mt-8">
    <Button label="Annuler" text @click="onCloseDialog" />

    <Button
      label="Insérer"
      :disabled="!file.src"
      @click="() => onCloseDialog(file)"
    >
      <template #icon>
        <Icon name="lucide:image-plus" />
      </template>
    </Button>
  </div>
</template>

<style scoped></style>
