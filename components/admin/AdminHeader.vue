<script lang="ts" setup>
import type { VNode } from 'vue';
import type { Tab } from '~/composables/useAdminTabHeader.js';

const modelValue = defineModel<string>('tab');

defineProps<{
  title: string;
  subtitle?: string;
  breadcrumb?: Array<{ label: string; url?: string }>;
  tabs?: Array<Tab>;
}>();
defineSlots<{
  actions?: () => VNode;
}>();
</script>

<template>
  <div class="admin-header" :class="{ 'with-tabs': tabs && tabs.length > 0 }">
    <div class="admin-header__content">
      <div class="admin-header__inner">
        <div v-if="breadcrumb" class="admin-header__breadcrumb">
          <router-link to="/admin">
            <Icon name="lucide:home" />
            <span>Accueil</span>
          </router-link>

          <Icon name="lucide:chevron-right" />

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

        <h1 class="admin-header__title">
          <!-- <Icon :name="`lucide:${icon}`" /> -->
          <span>{{ title }}</span>
        </h1>
        <p v-if="subtitle" class="text-gray-600 mt-2 mb-0">{{ subtitle }}</p>
      </div>

      <div v-if="$slots.actions" class="admin-header__actions">
        <slot name="actions" />
      </div>
    </div>
  </div>

  <div v-if="tabs && tabs.length > 0" class="admin-header__tabs">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :class="{ active: tab.key === modelValue }"
      @click="() => (modelValue = tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.admin-header {
  background-color: #fff;
  border-bottom: 1px solid theme('borderColor.gray.200');
  padding: theme('padding.4') theme('padding.8');
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
  margin-bottom: 0.5rem;
  font-size: 0.8rem;

  & > * {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: theme('colors.gray.600');
  }
  & > a:hover {
    color: #000;
  }
}

.admin-header__title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0;
  color: theme('colors.primary');
}

.admin-header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-header__tabs {
  background-color: #f9f9f9;
  border-top: 1px solid theme('borderColor.gray.200');
  border-bottom: 1px solid theme('borderColor.gray.200');
  padding: 0 theme('margin.4');

  button {
    padding: theme('padding.3') theme('padding.6');
    background-color: transparent;
    border: 2px solid transparent;
    cursor: pointer;
    color: theme('colors.gray.600');
    font-size: 1rem;

    &:hover {
      background-color: theme('backgroundColor.blue.50');
    }

    &.active {
      color: theme('colors.primary');
      border-bottom-color: theme('borderColor.primary');
    }
  }
}
</style>
