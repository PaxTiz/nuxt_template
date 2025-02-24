<script lang="tsx" setup>
defineProps<{
  name: string;
  icon: string;
  active?: boolean;
}>();

defineEmits<{ (e: 'click'): void }>();
</script>

<template>
  <button
    v-tooltip.top="name"
    class="editor__toolbar-button"
    :class="{ active }"
    @click="$emit('click')"
  >
    <Icon :name="`lucide:${icon}`" />
  </button>
</template>

<style scoped>
.editor__toolbar-button {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-300);
  cursor: pointer;
}

.editor__toolbar-button.active {
  color: var(--color-primary);
  background-color: var(--color-blue-100);
}
</style>
