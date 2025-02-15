<script lang="ts" setup>
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

const { user } = useUserSession();
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

const onLogout = async () => {
  await useCustomFetch('/api/auth/logout', { method: 'POST' });
  await navigateTo('/auth/connexion');
};
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__body">
      <template v-for="item in sidebar" :key="item.text">
        <ToggleableContent v-if="item.parent" :header="item.text" class="my-4">
          <template #header>
            <span class="text-xs uppercase">
              {{ item.text }}
            </span>
          </template>

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

    <div class="sidebar__end">
      <div class="sidebar__end-user">
        <span> {{ user?.firstname }} {{ user?.lastname }} </span>

        <div>
          <router-link to="/">
            <Button v-tooltip.top="'Retour au site'" text>
              <template #icon>
                <Icon name="lucide:square-arrow-out-up-left" />
              </template>
            </Button>
          </router-link>

          <Button
            v-tooltip.top="'Me déconnecter'"
            severity="danger"
            text
            @click="onLogout"
          >
            <template #icon>
              <Icon name="lucide:log-out" />
            </template>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.sidebar__body {
  padding: theme('padding.4');
}

.sidebar__end {
  padding: theme('padding.4');
}

.sidebar__end-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: theme('colors.gray.600');
  font-size: 0.9rem;
}
</style>
