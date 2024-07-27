<script lang="ts" generic="T extends object" setup>
import type { DataTablePageEvent } from 'primevue/datatable';
import type { VNode } from 'vue';

const page = defineModel<number>('page', { required: true });
const perPage = defineModel<number>('perPage', { required: true });
defineProps<{
  total: number;
  items: Array<T>;
  empty: string;
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
    :pt="{ root: { class: 'shadow-none border border-solid border-gray-200' } }"
  >
    <template #content>
      <div
        class="listing-header"
        :style="{
          'grid-template-columns': `repeat(${filtersPerRow ?? 2}, 1fr)`,
        }"
      >
        <slot name="filters" />
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
          <template #empty>
            {{ empty }}
          </template>

          <slot name="default" />
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.listing-header {
  display: grid;
  gap: 2rem;
}

.listing-divider {
  position: relative;
  height: 4px;
  margin: 1rem 0;
  display: flex;
  align-items: center;

  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  :deep(.p-divider) {
    height: 1px;
    margin: 0;
  }
}
</style>
