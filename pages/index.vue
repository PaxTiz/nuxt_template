<script lang="ts" setup>
const { user } = useAuth();
</script>

<template>
  <h1>Home</h1>
  <pre>
        <code>
            {{ user }}
        </code>
    </pre>

  <router-link to="/about">About</router-link>
</template>
