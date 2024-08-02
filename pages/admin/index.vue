<script lang="ts" setup>
import AdminHeader from '~/components/admin/AdminHeader.vue';

definePageMeta({ layout: 'admin', middleware: 'admin' });
</script>

<template>
  <AdminHeader title="Page d'accueil de l'administration" />

  <div class="p-8">
    <p class="m-0">Bienvenue !</p>
  </div>
</template>

<style lang="scss" scoped></style>
