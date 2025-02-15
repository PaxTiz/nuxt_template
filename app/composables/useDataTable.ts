import type { Paginated } from '#shared/types';

export const useDataTable = async <
  Filters extends Record<string, unknown>,
  Item extends Record<string, unknown>,
>({
  url,
  filters,
}: {
  url: string;
  filters: Filters;
}) => {
  const _filters = reactive<Filters>(filters);

  const { data, status, refresh } = await useCustomFetch<Paginated<Item>>(url, {
    query: _filters,
    watch: false,
    deep: false,
  });

  watch([() => _filters.page, () => _filters.perPage], () => {
    window?.scrollTo({ top: 0, behavior: 'smooth' });
  });

  watchDebounced(_filters, refresh, { debounce: 300, maxWait: 500 });

  return {
    items: computed(() => data.value!),
    pending: computed(() => status.value === 'pending'),
    filters: _filters,
    refresh,
  };
};
