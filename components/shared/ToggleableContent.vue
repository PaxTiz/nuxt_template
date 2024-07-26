<script lang="ts" setup>
import type { VNode } from 'vue';

const props = withDefaults(
  defineProps<{ header?: string; defaultOpen?: boolean }>(),
  {
    defaultOpen: true,
  },
);
defineSlots<{
  header?: () => VNode;
  default: () => VNode;
}>();

const isOpen = ref(props.defaultOpen);
</script>

<template>
  <div class="toggleable__content">
    <div class="toggleable__content-header" @click="isOpen = !isOpen">
      <div>
        <slot v-if="$slots.header" name="header" />
        <span v-else-if="header">{{ header }}</span>
      </div>

      <Icon :name="isOpen ? 'lucide:arrow-up' : 'lucide:arrow-down'" />
    </div>

    <div v-if="isOpen" class="toggleable__content-body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toggleable__content {
  display: flex;
  flex-direction: column;
}

.toggleable__content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.25rem 0;
  cursor: pointer;

  span {
    display: block;
    font-size: 1rem;
    font-weight: bold;
    color: theme('colors.blue.500');
    text-transform: uppercase;
  }
}
</style>
