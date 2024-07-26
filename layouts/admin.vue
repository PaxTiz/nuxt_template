<script lang="ts" setup>
import Sidebar from '~/components/admin/Sidebar.vue';
</script>

<template>
  <div class="admin__layout">
    <div class="admin__layout-logo">logo</div>

    <div class="admin__layout-header">
      <router-link to="/">
        <Button label="Retour au site" text>
          <template #icon>
            <Icon name="lucide:square-arrow-out-up-left" />
          </template>
        </Button>
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
    'logo header'
    'sidebar body';
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

.admin__layout-logo,
.admin__layout-header {
  background-color: theme('backgroundColor.gray.50');
}

.admin__layout-logo {
  grid-area: logo;
  border-right: 2px solid theme('borderColor.gray.200');
  border-bottom: 2px solid theme('borderColor.gray.200');
  padding: theme('padding.4');
  display: flex;
  align-items: center;
}

.admin__layout-header {
  grid-area: header;
  border-bottom: 2px solid theme('borderColor.gray.200');
  padding: theme('padding.4');
  display: flex;
  justify-content: flex-end;
}

.admin__layout-sidebar {
  grid-area: sidebar;
  border-right: 2px solid theme('borderColor.gray.200');
  padding: theme('padding.4');
}

.admin__layout-body {
  grid-area: body;
  padding: theme('padding.8');
}
</style>
