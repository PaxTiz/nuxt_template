<script lang="ts" setup>
import ValidateAccountForm from '~/components/auth/ValidateAccountForm.vue';

useHead({ title: 'Activer mon compte' });
</script>

<template>
  <NuxtLayout name="auth" title="Activer mon compte">
    <ValidateAccountForm />
  </NuxtLayout>
</template>
