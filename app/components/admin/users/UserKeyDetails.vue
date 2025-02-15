<script lang="ts" setup>
import type { User } from '~~/server/database';

const props = defineProps<{ user: User }>();

const { formatDate } = useFormatter();
const createdAt = formatDate(props.user.createdAt, 'dd/MM/yyyy à kk:mm');
const lastLoginAt = formatDate(props.user.lastLoginAt, 'dd/MM/yyyy à kk:mm');
</script>

<template>
  <div class="grid grid-cols-3 gap-4 mb-4">
    <div class="bg-white rounded p-4">
      <p class="text-gray-600 font-bold text-lg m-0 mb-2">{{ createdAt }}</p>
      <p class="text-gray-500 text-sm m-0">Inscrit le</p>
    </div>

    <div class="bg-white rounded p-4">
      <p class="text-gray-600 font-bold text-lg m-0 mb-2">{{ lastLoginAt }}</p>
      <p class="text-gray-500 text-sm m-0">Dernière connexion le</p>
    </div>
  </div>
</template>
