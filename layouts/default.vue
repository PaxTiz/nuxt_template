<script lang="ts" setup>
import CookieBanner from '~/components/shared/CookieBanner.vue';
</script>

<template>
  <Toast position="top-center" />
  <DynamicDialog />

  <CookieBanner />

  <slot />
</template>
