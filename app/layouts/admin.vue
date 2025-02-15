<script lang="ts" setup>
import Sidebar from '~/components/admin/Sidebar.vue';
</script>

<template>
  <NuxtLayout name="default">
    <div class="admin__layout">
      <div class="admin__layout-logo">
        <router-link to="/admin">
          <img
            src="https://about.google/assets-main/img/glue-google-color-logo.svg"
            alt=""
          />
        </router-link>
      </div>

      <div class="admin__layout-sidebar">
        <Sidebar />
      </div>

      <div class="admin__layout-body">
        <slot />
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.admin__layout {
  display: grid;
  grid-template-areas:
    'logo body'
    'sidebar body';
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  background: var(--admin-background);
}

.admin__layout-logo {
  grid-area: logo;
  padding: theme('padding.6') theme('padding.6') 0 theme('padding.6');
  display: flex;
  align-items: center;
  height: 75px;
}

.admin__layout-sidebar {
  grid-area: sidebar;
}

.admin__layout-body {
  grid-area: body;
  overflow-y: scroll;
  margin: theme('margin.4');
  height: min-content;
}
</style>
