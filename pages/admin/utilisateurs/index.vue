<script lang="ts" setup>
definePageMeta({ layout: 'admin', middleware: 'admin' });
</script>

<template>
  <AdminHeader
    title="Liste des utilisateurs"
    :breadcrumb="[
      {
        label: 'Utilisateurs',
        url: '/utilisateurs',
      },
    ]"
  >
    <template #actions>
      <a target="_blank" href="/api/admin/export?collection=users">
        <Button label="Exporter">
          <template #icon>
            <Icon name="lucide:download" />
          </template>
        </Button>
      </a>
    </template>
  </AdminHeader>

  <div class="border border-solid border-gray-200 rounded-lg">
    <UsersList />
  </div>
</template>

<style lang="scss" scoped></style>
