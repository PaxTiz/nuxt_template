export type Tab = {
  label: string;
  key: string;
};

export const useAdminTabHeader = <
  Tabs extends Array<Tab>,
  Key extends Tabs[number]['key'],
>(
  tabs: Tabs,
) => {
  const _tabs = ref(tabs);

  const currentTab = ref<Key>(tabs[0].key as Key);

  return {
    currentTab,
    tabs: _tabs,
  };
};
