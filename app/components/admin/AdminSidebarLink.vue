<script lang="ts" setup>
defineProps<{
  text: string;
  icon: string;
  to: string;
  active: boolean;
}>();
</script>

<template>
  <router-link class="sidebar__link" :to="to" :class="{ active }">
    <Icon :name="`lucide:${icon}`" size="20" />
    <span>{{ text }}</span>
  </router-link>
</template>

<style scoped>
.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray-500);
  text-decoration: none;
  padding: 0.25rem 0;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.sidebar__link:hover,
.sidebar__link.active {
  color: var(--color-gray-900);
  font-weight: 500;
}
</style>
