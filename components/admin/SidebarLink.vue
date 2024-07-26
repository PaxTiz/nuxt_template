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
  color: #000;
  text-decoration: none;
  padding: 0.5rem 0;

  &:hover,
  &.active {
    color: theme('colors.blue.500');
  }
}
</style>
