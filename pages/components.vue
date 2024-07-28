<script lang="ts" setup>
import DataImporter from '~/components/admin/DataImporter.vue';
import TextEditor from '~/components/shared/text_editor/TextEditor.vue';

const textEditorValue = ref('');
</script>

<template>
  <div class="components">
    <Card>
      <template #title>Éditeur de texte</template>
      <template #content>
        <TextEditor v-model="textEditorValue" />
      </template>
    </Card>

    <Card>
      <template #title>Extraction <-> import de fichier</template>
      <template #content>
        <DataImporter collection="demo" :preview-limit="10" />
      </template>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.components {
  margin: 4rem;

  :deep(.p-card) {
    margin-bottom: 2rem;
  }
}
</style>
