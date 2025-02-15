<script lang="ts" setup>
import { type UserResource } from '#shared/types';

const props = defineProps<{ user: UserResource }>();

const { formatDatetime } = useFormatter();
const createdAt = formatDatetime(props.user.createdAt);
const lastLoginAt = formatDatetime(props.user.lastLoginAt);
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
