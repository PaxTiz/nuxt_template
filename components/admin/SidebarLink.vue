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

<style lang="scss" scoped>
.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: theme('colors.gray.600');
  text-decoration: none;
  padding: 0.5rem 0;
  font-size: 0.9rem;

  &:hover,
  &.active {
    color: theme('colors.primary');
  }
}
</style>
