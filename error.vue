<script lang="ts" setup>
import { H3Error } from 'h3';

const props = defineProps<{ error: H3Error }>();
console.log(props);
if (props.error.statusCode === 401) {
  await navigateTo('/auth/connexion');
}

const title = computed(() => {
  switch (props.error.statusCode) {
    case 401:
      return 'Vous avez été déconnecté';
    case 403:
      return "Vous n'avez pas l'autorisation de faire cette action";
    case 404:
      return "La page demandée n'existe pas";
    default:
      return "Une erreur interne s'est produite";
  }
});

const back = () => {
  clearError({ redirect: '/' });
};
</script>

<template>
  <NuxtLayout name="auth" title="Il y a eu une erreur">
    <div class="text-center">
      <h2>{{ title }}</h2>

      <Button
        label="Retourner sur la page d'accueil"
        size="small"
        class="mt-4"
        @click="back"
      />
    </div>

    <DevOnly>
      <pre>
        <code>
          {{ error }}
        </code>
      </pre>
    </DevOnly>
  </NuxtLayout>
</template>

<style scoped lang="scss">
pre {
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-left: 5px solid theme('colors.gray.500');
  color: #666;
  page-break-inside: avoid;
  font-family: monospace;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 1.6em;
  max-width: 100%;
  overflow: auto;
  padding: 1em 1.5em;
  display: block;
  word-wrap: break-word;
}
</style>
