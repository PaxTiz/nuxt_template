<script lang="ts" setup>
const { session } = useUserSession();
</script>

<template>
  <h1>About</h1>
  <pre>
        <code>
            {{ session }}
        </code>
    </pre>

  <router-link to="/">Home</router-link>
</template>
