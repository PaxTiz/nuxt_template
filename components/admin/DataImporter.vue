<script lang="ts" generic="T extends Record<string, unknown>" setup>
import type { FileUploadSelectEvent } from 'primevue/fileupload';
import type { DataImporter } from '~/types';
import { mimeTypes } from '~/utils/shared/files';

const props = withDefaults(
  defineProps<{
    collection: DataImporter['Collection'];
    previewLimit: number | null;
  }>(),
  { previewLimit: 1000 },
);

const toast = useToast();
const showLayout = ref(true);
const items = ref<Array<T>>();
const isExtracting = ref(false);
const isImporting = ref(false);

const onFileSelected = async (event: FileUploadSelectEvent) => {
  const files = event.files;
  if (!files || files.length === 0) {
    return;
  }

  const file = files[0] as File;
  isExtracting.value = true;

  const formData = new FormData();
  formData.append('file', file);
  const { data, error } = await useCustomFetch<Array<T>>(
    `/api/importer/extract?collection=${props.collection}`,
    {
      errorKey: 'data_import',
      method: 'POST',
      body: formData,
    },
  );

  if (!error.value) {
    items.value = data.value!;
  }

  isExtracting.value = false;
};

const onImport = async () => {
  if (items.value?.length === 0) {
    return;
  }

  isImporting.value = true;
  const { error } = await useCustomFetch<Array<T>>('/api/importer/import', {
    errorKey: 'data_import',
    method: 'POST',
    body: {
      collection: props.collection,
      items: items.value,
    },
  });

  if (!error.value) {
    toast.add({
      severity: 'success',
      summary: 'Action réalisée avec succès',
      detail: 'Le fichier a été extrait et les lignes importées correctement',
      life: 3000,
    });
  }

  onReset();
};

const onReset = () => {
  items.value = undefined;
  isExtracting.value = false;
  isImporting.value = false;

  showLayout.value = false;
  nextTick(() => {
    showLayout.value = true;
  });
};
</script>

<template>
  <div v-if="showLayout" class="data-importer">
    <div class="data-importer__header">
      <Button v-if="isExtracting" label="Extraction en cours..." loading />
      <Button v-else-if="isImporting" label="Import en cours..." loading />
      <Button
        v-else-if="items && items.length > 0"
        label="Confirmer l'import"
        severity="success"
        @click="onImport"
      >
        <template #icon>
          <Icon name="lucide:check" />
        </template>
      </Button>
      <FileUpload
        v-else
        mode="basic"
        invalid-file-type-message="Type de fichier invalide"
        :accept="mimeTypes.csv"
        @select="onFileSelected"
      />

      <Button
        label="Réinitialiser"
        :disabled="isExtracting || isImporting"
        severity="secondary"
        @click="onReset"
      >
        <template #icon>
          <Icon name="lucide:refresh-cw" />
        </template>
      </Button>
    </div>

    <div class="data-importer__body">
      <AlertErrors for="data_import" />

      <template v-if="items">
        <p v-if="items.length === 0">
          Aucune ligne n'a été extraite du fichier.
        </p>

        <template v-else>
          <p v-if="previewLimit !== null">
            Le tableau ci-dessous représente un apperçu des
            {{ items.length > previewLimit ? previewLimit : items.length }}
            premières lignes extraites sur un total de {{ items.length }}. Si
            quelque chose ne vous semble pas correct (mauvais format, données
            manquantes, ...), veuillez vérifier le fichier d'entrée avant de
            recommencer un import afin d'éviter d'éventuelles erreurs.
          </p>
          <DataTable
            :value="previewLimit ? items.slice(0, previewLimit) : items"
          >
            <Column
              v-for="key in Object.keys(items[0])"
              :key="key"
              :field="key"
              :header="key"
            />
          </DataTable>
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.data-importer__header {
  display: flex;
  justify-content: space-between;
}

.data-importer__body {
  margin-top: 2rem;
}
</style>
