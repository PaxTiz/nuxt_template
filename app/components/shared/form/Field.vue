<script setup lang="ts">
import type { VNode } from 'vue';

const props = defineProps<{
  id: string;
  label?: string;
  error?: string;
  helpTitle?: string;
  helpMessage?: string;
}>();
const slots = defineSlots<{
  default: (values: { id: string; error?: string; hasError: boolean }) => VNode;
  inlineHelp?: () => VNode;
  help?: () => VNode;
}>();

const isModalOpen = ref(false);
const needHelp = computed(() => props.helpMessage || slots.help);
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

      <Icon
        v-if="needHelp && !$slots.inlineHelp"
        class="cursor-pointer"
        name="lucide:circle-help"
        @click="isModalOpen = true"
      />
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

    <Dialog
      v-if="needHelp"
      to="body"
      v-model:visible="isModalOpen"
      :header="helpTitle"
      :style="{ maxWidth: '500px' }"
      :draggable="false"
      append-to="body"
      modal
      dismissable-mask
      close-on-escape
      block-scroll
    >
      <p v-if="helpMessage" class="m-0">{{ helpMessage }}</p>
      <slot v-else name="help" />
    </Dialog>
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
