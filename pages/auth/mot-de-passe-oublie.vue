<script lang="ts" setup>
import ForgotPasswordForm from '~/components/auth/ForgotPasswordForm.vue';

useHead({ title: 'Mot de passe oublié' });
</script>

<template>
  <NuxtLayout name="auth" title="Mot de passe oublié">
    <ForgotPasswordForm />
  </NuxtLayout>
</template>
