<script lang="ts" setup>
defineProps<{ title: string }>();
</script>

<template>
  <NuxtLayout name="default">
    <div class="auth-layout">
      <div class="auth">
        <h1 class="text-primary m-0">{{ title }}</h1>

        <div class="auth-content">
          <slot />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.auth-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: theme('backgroundColor.gray.100');
}

.auth-layout .auth {
  width: 600px;
  background-color: #fff;
  padding: 2rem;
  border-radius: theme('borderRadius.lg');
  border: 1px solid theme('borderColor.gray.400');
}

.auth-layout .auth h1 {
  text-align: center;
}

.auth-layout .auth-content {
  margin-top: 2rem;
}
</style>
