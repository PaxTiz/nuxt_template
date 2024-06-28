<script lang="ts" setup>
const { areCookiesEnabled } = useMiamMiam();
</script>

<template>
  <Teleport v-if="areCookiesEnabled === undefined" to="body">
    <div class="miam-miam">
      <div class="miam-miam__body">
        <span>
          {{ $config.public.applicationName }} utilise Google Analytics afin de
          récupérer des statistiques d'utilisation
        </span>

        <div class="miam-miam__actions">
          <Button
            label="J'accepte les cookies"
            @click="() => (areCookiesEnabled = true)"
          />
          <Button
            label="Je refuse"
            severity="danger"
            @click="() => (areCookiesEnabled = false)"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.miam-miam {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background-color: #333;
  border-radius: theme('borderRadius.DEFAULT');
  box-shadow: theme('boxShadow.2xl');
  padding: 1rem;
  color: #fff;

  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__actions {
    display: flex;
    gap: 1rem;
  }
}
</style>
