<script lang="ts" setup>
import type { User } from '~~/server/database';

definePageMeta({ layout: 'admin', middleware: 'admin' });

const route = useRoute();
const { data } = await useCustomFetch<User>(`/api/users/${route.params.id}`);

const { currentTab, tabs } = useAdminTabHeader([
  { label: 'Modifier', key: 'update_form' },
] as const);

const { formatDate } = useFormatter();
const createdAt = formatDate(
  data.value!.createdAt,
  'EEEE dd MMMM yyyy à kk:mm',
);
</script>

<template>
  <AdminHeader
    v-model:tab="currentTab"
    :title="`Aperçu de ${data!.firstname} ${data!.lastname}`"
    :subtitle="`Utilisateur crée le ${createdAt}`"
    :breadcrumb="[
      { label: 'Utilisateurs', url: '/utilisateurs' },
      { label: `${data!.firstname} ${data!.lastname}` },
    ]"
    :tabs="tabs"
  />

  <div class="border border-solid border-gray-200 rounded-b-lg bg-white">
    <UserForm v-if="currentTab === 'update_form'" :user="data" />
  </div>
</template>

<style scoped></style>
