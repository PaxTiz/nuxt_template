<script lang="ts" setup>
import { type UserResource } from '#shared/types';

definePageMeta({ layout: 'admin', middleware: 'admin' });

const route = useRoute();
const { data } = await useCustomFetch<UserResource>(
  `/api/users/${route.params.id}`,
);
</script>

<template>
  <AdminHeader
    :title="`Aperçu de ${data!.firstname} ${data!.lastname}`"
    :breadcrumb="[
      { label: 'Utilisateurs', url: '/utilisateurs' },
      { label: `Modifier l'utilisateur ${data!.firstname} ${data!.lastname}` },
    ]"
  />

  <UserKeyDetails :user="data!" />

  <Tabs value="0">
    <TabList>
      <Tab value="0">Modifier</Tab>
    </TabList>

    <TabPanel value="0">
      <Card :pt="{ root: { class: 'p-0 rounded-t-none rounded-b' } }">
        <template #content>
          <UserForm :user="data!" />
        </template>
      </Card>
    </TabPanel>
  </Tabs>
</template>

<style scoped></style>
