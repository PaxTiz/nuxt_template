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

<style lang="scss" scoped>
.editor__toolbar-button {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  background-color: theme('backgroundColor.white');
  border: 1px solid theme('colors.gray.300');
  cursor: pointer;

  &.active {
    color: theme('colors.blue.500');
    background-color: theme('backgroundColor.blue.100');
  }
}
</style>
