<script lang="ts" setup>
import type { VNode } from 'vue';

defineProps<{ title: string; subtitle?: string; icon: string }>();
defineSlots<{ actions?: () => VNode }>();
</script>

<template>
  <div class="admin-header">
    <div class="admin-header__inner">
      <h1 class="admin-header__title">
        <Icon :name="`lucide:${icon}`" />
        <span>{{ title }}</span>
      </h1>
      <p v-if="subtitle" class="mb-0 ml-[calc(32px+1rem)]">{{ subtitle }}</p>
    </div>

    <div v-if="$slots.actions" class="admin-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.admin-header__title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0;
  color: theme('colors.blue.500');
}

.admin-header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
