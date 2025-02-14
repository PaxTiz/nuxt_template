<script lang="ts" generic="T extends object" setup>
import type { DataTablePageEvent } from 'primevue/datatable';
import type { VNode } from 'vue';

const page = defineModel<number>('page', { required: true });
const perPage = defineModel<number>('perPage', { required: true });
defineEmits<{ (e: 'filter'): void }>();
defineProps<{
  total: number;
  items: Array<T>;
  filtersPerRow?: number;
  loading?: boolean;
}>();
defineSlots<{
  filters: () => VNode;
  default: () => VNode;
}>();

const onPaginate = (event: DataTablePageEvent) => {
  page.value = event.page + 1;
  perPage.value = event.rows;
};
</script>

<template>
  <Card
    :pt="{
      root: { class: 'shadow-none rounded-lg' },
      body: { class: 'p-0' },
    }"
  >
    <template #content>
      <div
        class="listing-header px-4 pt-4"
        :style="{
          'grid-template-columns': `repeat(${filtersPerRow ?? 3}, 1fr)`,
        }"
      >
        <slot name="filters" />

        <Button @click="$emit('filter')">
          <template #icon>
            <Icon name="lucide:filter" />
          </template>
        </Button>
      </div>

      <div class="listing-divider">
        <ProgressBar v-if="loading" mode="indeterminate" style="height: 4px" />
        <Divider v-else />
      </div>

      <div class="listing-body">
        <DataTable
          :value="items"
          :total-records="total"
          :rows="perPage"
          :rowsPerPageOptions="[10, 20, 50, 100]"
          @page="onPaginate"
          paginator
          lazy
        >
          <template #empty> Aucun élément n'a été trouvé </template>

          <slot name="default" />
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.listing-header {
  display: grid;
  gap: 1rem;
}

.listing-divider {
  position: relative;
  height: 4px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
}

.listing-divider > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.listing-divider :deep(.p-divider) {
  height: 1px;
  margin: 0;
}
</style>
