<script lang="ts" setup>
import AdminHeader from '~/components/admin/AdminHeader.vue';
import UserForm from '~/components/admin/users/UserForm.vue';
import type { User } from '~/server/database';

definePageMeta({ layout: 'admin', middleware: 'admin' });

const route = useRoute();
const { data } = await useCustomFetch<User>(
  `/api/admin/users/${route.params.id}`,
);

const { formatDate } = useFormatter();
const createdAt = formatDate(data.value.createdAt, 'EEEE dd MMMM yyyy à kk:mm');
</script>

<template>
  <AdminHeader
    :title="`Modifier l'utilisateur ${data.firstname} ${data.lastname}`"
    :subtitle="`Utilisateur crée le ${createdAt}`"
    icon="user-round"
  />

  <UserForm :user="data" />
</template>

<style lang="scss" scoped></style>
