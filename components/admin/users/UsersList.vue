<script lang="ts" setup>
import type { User } from '~/server/database';

const activeAccountOptions = [
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
];

const filters = ref<{ query?: string; isActive?: boolean }>({
  query: undefined,
  isActive: undefined,
});

const users = ref<Array<User>>([]);
watch(
  filters,
  async (newFilters) => {
    const { data } = await useCustomFetch<Array<User>>('/api/admin/users', {
      key: new Date().toLocaleDateString(),
      query: newFilters,
    });

    users.value = data.value;
  },
  { immediate: true },
);
</script>

<template>
  <Card
    :pt="{ root: { class: 'shadow-none border border-solid border-gray-200' } }"
  >
    <template #content>
      <div class="listing-header">
        <InputText v-model="filters.query" placeholder="Rechercher..." />

        <Select
          v-model="filters.isActive"
          placeholder="Compte activé ?"
          :options="activeAccountOptions"
          option-label="label"
          option-value="value"
        />
      </div>

      <Divider />

      <div class="listing-body">
        <DataTable :value="users">
          <Column field="firstname" header="Prénom" />

          <Column field="lastname" header="Nom" />

          <Column field="email" header="Email" />

          <Column header="Compte activé ?">
            <template #body="{ data }: { data: User }">
              {{ data.isEnabled ? 'Oui' : 'Non' }}
            </template>
          </Column>

          <Column field="role" header="Role" />

          <Column>
            <template #body="{ data }: { data: User }">
              <Button label="Voir" text>
                <template #icon>
                  <Icon name="lucide:edit-3" />
                </template>
              </Button>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.listing-header {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}
</style>
