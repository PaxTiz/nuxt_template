<script lang="ts" setup>
const { session } = useUserSession();
</script>

<template>
  <h1>Home</h1>
  <pre>
        <code>
            {{ session }}
        </code>
    </pre>

  <router-link to="/about">About</router-link>
</template>
