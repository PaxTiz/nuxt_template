<script lang="ts" setup>
import type { VNode } from 'vue';

defineProps<{
  title: string;
  breadcrumb?: Array<{ label: string; url?: string }>;
}>();
defineSlots<{
  actions?: () => VNode;
}>();
</script>

<template>
  <div class="admin-header">
    <div class="admin-header__content">
      <div class="admin-header__inner">
        <div v-if="breadcrumb" class="admin-header__breadcrumb">
          <router-link to="/admin">
            <Icon
              name="lucide:chevron-left"
              class="text-2xl"
              style="margin-top: 4px"
            />
          </router-link>

          <div class="mx-2 text-gray-400">|</div>

          <template v-for="(item, index) in breadcrumb" :key="item.label">
            <router-link v-if="item.url" :to="`/admin${item.url}`">
              {{ item.label }}
            </router-link>
            <span v-else>{{ item.label }}</span>

            <Icon
              v-if="index !== breadcrumb.length - 1"
              name="lucide:chevron-right"
            />
          </template>
        </div>
      </div>

      <div v-if="$slots.actions" class="admin-header__actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-header {
  margin-bottom: calc(var(--spacing) * 4);
}

.admin-header__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}
.admin-header__breadcrumb > a,
.admin-header__breadcrumb > span {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-gray-500);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}
.admin-header__breadcrumb > a:hover {
  color: var(--color-gray-900);
}
.admin-header__breadcrumb > a:not(:first-child):hover {
  border-color: var(--color-gray-900);
}

.admin-header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
