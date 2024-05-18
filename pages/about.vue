<script lang="ts" setup>
const { user } = useAuth();
</script>

<template>
  <h1>About</h1>
  <pre>
        <code>
            {{ user }}
        </code>
    </pre>

  <router-link to="/">Home</router-link>
</template>
