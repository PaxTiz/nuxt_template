<script lang="ts" generic="T" setup>
import useEmblaCarousel from 'embla-carousel-vue';
import type { VNode } from 'vue';

defineSlots<{ default: (props: { item: T }) => VNode }>();
const props = withDefaults(
  defineProps<{
    items: Array<T>;
    slidesPerPage: number;
    slidesToScroll?: number;
    navigation?: boolean;
    pagination?: boolean;
    loop?: boolean;
    gap?: string | number;
  }>(),
  {
    perPage: 1,
    slidesToScroll: 1,
    navigation: true,
    pagination: true,
    loop: false,
    gap: '16px',
  },
);

const state = reactive({
  index: 0,
  canScrollLeft: props.loop,
  canScrollRight: true,
});

const [emblaRef, api] = useEmblaCarousel({
  loop: props.loop,
  slidesToScroll: props.slidesToScroll,
});

const scrollToIndex = (index: number) => {
  if (api.value) {
    api.value.scrollTo(index);
    state.index = index;
    state.canScrollLeft = api.value.canScrollPrev();
    state.canScrollRight = api.value.canScrollNext();
  }
};

const slidesGap = computed(() => {
  if (typeof props.gap === 'number') {
    return `${props.gap}px`;
  }

  return props.gap;
});

onMounted(() => {
  api.value?.on('scroll', () => {
    state.index = api.value!.selectedScrollSnap();
    state.canScrollLeft = api.value!.canScrollPrev();
    state.canScrollRight = api.value!.canScrollNext();
  });
});

onBeforeUnmount(() => api.value?.destroy());
</script>

<template>
  <div class="embla">
    <div ref="emblaRef" class="embla__viewport">
      <div class="embla__container">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="embla__slide"
          :style="{ flex: `0 0 calc(100% / ${props.slidesPerPage})` }"
        >
          <slot name="default" :item="item" />
        </div>
      </div>
    </div>

    <div v-if="navigation || pagination" class="embla__meta">
      <div v-if="navigation" class="embla__navigation">
        <button
          class="embla__navigation-button"
          :disabled="!state.canScrollLeft"
          @click="() => api?.scrollPrev()"
        >
          <Icon name="lucide:chevron-left" />
        </button>
        <button
          class="embla__navigation-button"
          :disabled="!state.canScrollRight"
          @click="() => api?.scrollNext()"
        >
          <Icon name="lucide:chevron-right" />
        </button>
      </div>

      <div v-if="pagination" class="embla__pagination">
        <button
          v-for="(item, index) in api?.scrollSnapList() ?? []"
          :key="index"
          class="embla__pagination-button"
          :class="{ 'embla__pagination-selected': state.index === index }"
          @click="() => scrollToIndex(index)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.embla {
  margin: auto;
  --slide-spacing: v-bind(slidesGap);
}

.embla__viewport {
  overflow: hidden;
}
.embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);
}
.embla__slide {
  transform: translate3d(0, 0, 0);
  min-width: 0;
  padding-left: var(--slide-spacing);
}

.embla__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.embla__navigation-button,
.embla__pagination-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  font-size: 1rem;
  background: transparent;
  border: 1px solid theme('borderColor.gray.300');
  border-radius: 50%;
  cursor: pointer;
}
.embla__navigation {
  display: flex;
  margin-top: 1rem;
  gap: 0.5rem;
}

.embla__pagination {
  display: flex;
  margin-top: 1rem;
  gap: 0.5rem;

  &-button {
    width: 20px;
    height: 20px;
  }

  &-selected {
    border: 3px solid theme('borderColor.primary');
  }
}
</style>
