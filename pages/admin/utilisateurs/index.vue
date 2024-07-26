<script lang="ts" setup>
import AdminHeader from '~/components/admin/AdminHeader.vue';
import UsersList from '~/components/admin/users/UsersList.vue';

definePageMeta({ layout: 'admin', middleware: 'admin' });
</script>

<template>
  <AdminHeader title="Liste des utilisateurs" icon="users">
    <template #actions>
      <Button label="Exporter">
        <template #icon>
          <Icon name="lucide:download" />
        </template>
      </Button>
    </template>
  </AdminHeader>

  <UsersList />
</template>

<style lang="scss" scoped></style>
