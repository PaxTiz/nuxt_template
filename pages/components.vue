<script lang="ts" setup>
import TextEditor from '~/components/shared/text_editor/TextEditor.vue';

const textEditorValue = ref('');
</script>

<template>
  <div class="components">
    <TextEditor v-model="textEditorValue" />
  </div>
</template>

<style lang="scss" scoped>
.components {
  margin: 4rem;
}
</style>
