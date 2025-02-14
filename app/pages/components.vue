<script lang="ts" setup>
import { Carousel } from '#components';

const textEditorValue = ref('');

const carouselItems = [
  {
    label: 'Image #1',
    image: 'https://picsum.photos/id/1/500/300',
  },
  {
    label: 'Image #2',
    image: 'https://picsum.photos/id/10/500/300',
  },
  {
    label: 'Image #3',
    image: 'https://picsum.photos/id/100/500/300',
  },
  {
    label: 'Image #4',
    image: 'https://picsum.photos/id/1000/500/300',
  },
];

const onFilesSelected = (files: Array<File>) => {
  console.log({ files });
};
</script>

<template>
  <div class="components">
    <Card>
      <template #title>File Uploader</template>
      <template #content>
        <DropZone @select="onFilesSelected" multiple />
      </template>
    </Card>

    <Card>
      <template #title>Carousel</template>
      <template #content>
        <div style="width: 800px; margin: 0 auto">
          <Carousel
            :items="carouselItems"
            :slides-per-page="1"
            :slides-to-scroll="1"
            v-slot="{ item }"
          >
            <img :src="item.image" class="w-full block" />
          </Carousel>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Éditeur de texte</template>
      <template #content>
        <TextEditor v-model="textEditorValue" />
      </template>
    </Card>

    <Card>
      <template #title>Extraction <-> import de fichier</template>
      <template #content>
        <DataImporter collection="demo" :preview-limit="10" />
      </template>
    </Card>
  </div>
</template>

<style scoped>
.components {
  margin: 4rem;
}

.components :deep(.p-card) {
  margin-bottom: 2rem;
}
</style>
