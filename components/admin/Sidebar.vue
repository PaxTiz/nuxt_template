<script lang="ts" setup>
import SidebarLink from '~/components/admin/SidebarLink.vue';
import ToggleableContent from '~/components/shared/ToggleableContent.vue';

type SidebarItem = {
  parent?: false;
  text: string;
  to: string;
  icon: string;
  active: boolean;
};
type Sidebar = Array<
  { text: string; children: Array<SidebarItem>; parent: true } | SidebarItem
>;

const route = useRoute();
const sidebar = computed<Sidebar>(() => [
  {
    text: 'Accueil',
    to: '/admin',
    icon: 'home',
    active: route.path === '/admin',
  },
  {
    parent: true,
    text: 'Utilisateurs',
    children: [
      {
        text: 'Liste',
        to: '/admin/utilisateurs',
        icon: 'users',
        active: route.path === '/admin/utilisateurs',
      },
    ],
  },
]);
</script>

<template>
  <div class="sidebar">
    <template v-for="item in sidebar" :key="item.text">
      <ToggleableContent v-if="item.parent" :header="item.text" class="my-4">
        <SidebarLink
          v-for="child in item.children"
          :key="child.text"
          :text="child.text"
          :to="child.to"
          :icon="child.icon"
          :active="child.active"
        />
      </ToggleableContent>
      <SidebarLink
        v-else
        :text="item.text"
        :to="item.to"
        :icon="item.icon"
        :active="item.active"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
