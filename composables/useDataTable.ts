import type { Reactive } from 'vue';
import type { Paginated } from '~/types';

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
  const _filters = reactive<Filters>(filters) as Reactive<Filters>;

  const { data, pending, refresh } = await useCustomFetch<Paginated<Item>>(
    url,
    {
      query: _filters,
      watch: false,
    },
  );

  watch([() => _filters.page, () => _filters.perPage], () => {
    window?.scrollTo({ top: 0, behavior: 'smooth' });
  });

  return {
    items: computed(() => data.value!),
    pending,
    filters: _filters,
    refresh,
  };
};
