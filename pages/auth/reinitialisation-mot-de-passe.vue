<script lang="ts" setup>
import ResetPasswordForm from '~/components/auth/ResetPasswordForm.vue';

useHead({ title: 'Réinitialiser mon mot de passe' });
</script>

<template>
  <NuxtLayout name="auth" title="Réinitialiser mon mot de passe">
    <ResetPasswordForm />
  </NuxtLayout>
</template>
