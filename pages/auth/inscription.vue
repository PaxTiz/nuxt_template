<script lang="ts" setup>
import RegisterForm from '~/components/auth/RegisterForm.vue';

useHead({ title: 'Inscription' });
</script>

<template>
  <NuxtLayout name="auth" title="Inscription">
    <RegisterForm />
  </NuxtLayout>
</template>
