<script lang="ts" setup>
import LoginForm from '~/components/auth/LoginForm.vue';

useHead({ title: 'Connexion' });
</script>

<template>
  <NuxtLayout name="auth" title="Connexion">
    <LoginForm />
  </NuxtLayout>
</template>
