<script lang="ts" setup>
import Sidebar from '~/components/admin/Sidebar.vue';
</script>

<template>
  <Toast position="top-center" />

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
</template>

<style lang="scss" scoped>
.admin__layout {
  display: grid;
  grid-template-areas:
    'logo body'
    'sidebar body';
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
}

.admin__layout-logo,
.admin__layout-header,
.admin__layout-sidebar {
  background-color: #fff;
}

.admin__layout-logo {
  grid-area: logo;
  border-right: 2px solid rgb(0 0 0 / 0.06);
  padding: theme('padding.6') theme('padding.6') 0 theme('padding.6');
  display: flex;
  align-items: center;
  height: 75px;
}

.admin__layout-sidebar {
  grid-area: sidebar;
  border-right: 2px solid rgb(0 0 0 / 0.06);
}

.admin__layout-body {
  grid-area: body;
  background-color: theme('backgroundColor.gray.50');
  overflow-y: scroll;
}
</style>
