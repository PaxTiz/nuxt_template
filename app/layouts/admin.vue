<script lang="ts" setup></script>

<template>
  <NuxtLayout name="default">
    <div class="admin__layout">
      <div class="admin__layout-logo">
        <router-link to="/admin">
          <img
            src="https://about.google/assets-main/img/glue-google-color-logo.svg"
            alt="Logo de l'application"
          />
        </router-link>
      </div>

      <div class="admin__layout-sidebar">
        <AdminSidebar />
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
  background: var(--color-admin-background);
}

.admin__layout-logo {
  grid-area: logo;
  padding: calc(var(--spacing) * 6) calc(var(--spacing) * 4) 0
    calc(var(--spacing) * 4);
  display: flex;
  align-items: center;
}
.admin__layout-logo img {
  width: auto;
  height: 35px;
}

.admin__layout-sidebar {
  grid-area: sidebar;
}

.admin__layout-body {
  grid-area: body;
  overflow-y: scroll;
  margin: calc(var(--spacing) * 4);
  height: min-content;
}
</style>
