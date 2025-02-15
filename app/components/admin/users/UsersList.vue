<script lang="ts" setup>
import type { UserResource, Users } from '#shared/types';

const activeAccountOptions = [
  { label: 'Tout', value: undefined },
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
];

const { items, filters, pending } = await useDataTable<
  Users['Search'],
  UserResource
>({
  url: '/api/users',
  filters: {
    page: 1,
    perPage: 20,
    query: undefined,
    isEnabled: undefined,
  },
});
</script>

<template>
  <AdminDataTable
    v-model:page="filters.page"
    v-model:per-page="filters.perPage"
    :items="items.items"
    :total="items.total"
    :filters-per-row="3"
    :loading="pending"
  >
    <template #filters>
      <InputText
        v-model="filters.query"
        placeholder="Rechercher..."
        class="w-full"
      />

      <Select
        v-model="filters.isEnabled"
        placeholder="Compte activé ?"
        :options="activeAccountOptions"
        option-label="label"
        option-value="value"
        class="w-full"
      />
    </template>

    <Column field="firstname" header="Prénom" />

    <Column field="lastname" header="Nom" />

    <Column field="email" header="Email" />

    <Column header="Compte activé ?">
      <template #body="{ data }: { data: UserResource }">
        <Tag
          :severity="data.isEnabled ? 'success' : 'danger'"
          :value="data.isEnabled ? 'Oui' : 'Non'"
        />
      </template>
    </Column>

    <Column field="role" header="Role">
      <template #body="{ data }: { data: UserResource }">
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
      <template #body="{ data }: { data: UserResource }">
        <router-link :to="`/admin/utilisateurs/${data.id}`">
          <Button label="Voir" text>
            <template #icon>
              <Icon name="lucide:edit-3" />
            </template>
          </Button>
        </router-link>
      </template>
    </Column>
  </AdminDataTable>
</template>
