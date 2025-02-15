<script lang="ts" setup>
import type { User } from '~~/server/database';
import UserKeyDetails from '~/components/admin/users/UserKeyDetails.vue';

definePageMeta({ layout: 'admin', middleware: 'admin' });

const route = useRoute();
const { data } = await useCustomFetch<User>(`/api/users/${route.params.id}`);
</script>

<template>
  <AdminHeader
    :title="`Aperçu de ${data!.firstname} ${data!.lastname}`"
    :breadcrumb="[
      { label: 'Utilisateurs', url: '/utilisateurs' },
      { label: `Modifier l'utilisateur ${data!.firstname} ${data!.lastname}` },
    ]"
  />

  <UserKeyDetails :user="data" />

  <TabView>
    <TabPanel header="Modifier">
      <UserForm :user="data" />
    </TabPanel>
  </TabView>
</template>

<style scoped></style>
