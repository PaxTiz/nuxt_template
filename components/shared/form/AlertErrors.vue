<script setup lang="ts">
const props = defineProps<{ for: string }>();

const { errors } = useFormErrors(props.for);
</script>

<template>
  <Message
    v-if="errors.length > 0"
    severity="error"
    class="mb-6"
    :closable="false"
    sticky
  >
    <div class="py-2">
      <ul v-if="errors.length > 1" class="m-0">
        <li v-for="error in errors" :key="error.key">
          {{ error.message }}
        </li>
      </ul>
      <span v-else>{{ errors[0].message }}</span>
    </div>
  </Message>
</template>
