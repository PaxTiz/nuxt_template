<script lang="ts" setup>
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef');

const link = ref<{ href?: string; target: '_blank' | '_self' }>({
  href: dialogRef?.value.data.previousURL,
  target: '_blank',
});

const onCloseDialog = <T,>(data: T) => {
  dialogRef?.value?.close(data);
};
</script>

<template>
  <div class="flex items-center gap-4 w-full">
    <InputText v-model="link.href" placeholder="Entrez une URL" />
    <Select
      v-model="link.target"
      :options="[
        { label: 'Autre page', value: '_blank' },
        { label: 'Page courante', value: '_self' },
      ]"
      option-label="label"
      option-value="value"
    />
  </div>

  <div class="flex justify-end gap-4 w-full mt-8">
    <Button label="Annuler" text @click="onCloseDialog" />

    <Button
      label="Insérer"
      :disabled="!link.href"
      @click="() => onCloseDialog(link)"
    >
      <template #icon>
        <Icon name="lucide:link" />
      </template>
    </Button>
  </div>
</template>

<style lang="scss" scoped></style>
