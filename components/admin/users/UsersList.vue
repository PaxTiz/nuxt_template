<script lang="ts" setup>
import type { User } from '~/server/database';
import type { AdminUsers } from '~/types';
import AdminDataTable from '../AdminDataTable.vue';

const activeAccountOptions = [
  { label: 'Tout', value: undefined },
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
];

const { items, filters, isLoading, fetch } = useAdminSearch<
  AdminUsers['Search'],
  User
>({
  url: '/api/admin/users',
  filters: {
    page: 1,
    perPage: 20,
    query: undefined,
    isEnabled: undefined,
  },
});

await fetch();
</script>

<template>
  <AdminDataTable
    v-model:page="filters.page"
    v-model:per-page="filters.perPage"
    :items="items.items"
    :total="items.total"
    :filters-per-row="2"
    :loading="isLoading"
    empty="Aucun utilisateur trouvé pour votre recherche"
  >
    <template #filters>
      <InputText v-model="filters.query" placeholder="Rechercher..." />

      <Select
        v-model="filters.isEnabled"
        placeholder="Compte activé ?"
        :options="activeAccountOptions"
        option-label="label"
        option-value="value"
      />
    </template>

    <Column field="firstname" header="Prénom" />

    <Column field="lastname" header="Nom" />

    <Column field="email" header="Email" />

    <Column header="Compte activé ?">
      <template #body="{ data }: { data: User }">
        <Tag
          :severity="data.isEnabled ? 'success' : 'danger'"
          :value="data.isEnabled ? 'Oui' : 'Non'"
        />
      </template>
    </Column>

    <Column field="role" header="Role">
      <template #body="{ data }: { data: User }">
        <Tag
          :severity="
            data.role === 'USER'
              ? 'primary'
              : data.role === 'ADMIN'
                ? 'secondary'
                : 'contrast'
          "
          :value="data.role"
        />
      </template>
    </Column>

    <Column>
      <template #body="{ data }: { data: User }">
        <Button label="Voir" text>
          <template #icon>
            <Icon name="lucide:edit-3" />
          </template>
        </Button>
      </template>
    </Column>
  </AdminDataTable>
</template>
