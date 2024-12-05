import type { Reactive } from 'vue';
import type { Paginated } from '~/types';

export const useAdminSearch = <
  Filters extends Record<string, unknown>,
  Item extends Record<string, unknown>,
>({
  url,
  filters,
  client,
}: {
  url: string;
  filters: Filters;
  client?: boolean;
}) => {
  const _filters = reactive<Filters>(filters) as Reactive<Filters>;
  const items = ref<Paginated<Item>>({ total: 0, items: [] }) as Ref<
    Paginated<Item>
  >;
  const isLoading = ref(false);

  const fetchData = async (filters?: Filters | Reactive<Filters>) => {
    isLoading.value = true;
    const { data } = await useCustomFetch<Paginated<Item>>(url, {
      query: filters ?? _filters,
    });

    items.value = data.value;
    isLoading.value = false;
  };

  watch([() => _filters.page, () => _filters.perPage], () => {
    window?.scrollTo({ top: 0, behavior: 'smooth' });
  });

  return {
    isLoading: readonly(isLoading),
    filters: _filters,
    items,

    fetch: fetchData,
  };
};
