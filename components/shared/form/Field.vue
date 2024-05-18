<script setup lang="ts">
import type { VNode } from 'vue';

defineProps<{
  id: string;
  label?: string;
  error?: string;
}>();
defineSlots<{
  default: (values: { id: string; error?: string; hasError: boolean }) => VNode;
  inlineHelp?: () => VNode;
}>();
</script>

<template>
  <div class="form-group">
    <label
      v-if="label"
      :for="id"
      :class="{
        'text-red-500': error !== undefined,
        'justify-between': !!$slots.inlineHelp,
      }"
      class="relative flex items-center gap-1"
    >
      <span>{{ label }}</span>

      <slot v-if="$slots.inlineHelp" name="inlineHelp" />
    </label>
    <slot
      :id="id"
      name="default"
      :error="error"
      :has-error="error !== undefined"
    />
    <small v-if="error !== undefined" class="text-red-500">
      {{ error }}
    </small>
  </div>
</template>

<style scoped lang="scss">
.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;

  label {
    font-weight: 600;
  }
}
</style>
