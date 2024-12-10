<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import AlertErrors from '~/components/shared/form/AlertErrors.vue';
import Field from '~/components/shared/form/Field.vue';
import { authSchema } from '~/types';

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(authSchema.registerForm),
  initialValues: { address: {} },
});

const toast = useToast();

const [firstname] = defineField('firstname');
const [lastname] = defineField('lastname');
const [email] = defineField('email');
const [password] = defineField('password');
const [passwordConfirmation] = defineField('passwordConfirmation');
const [addressLine1] = defineField('address.line1');
const [addressLine2] = defineField('address.line2');
const [addressCity] = defineField('address.city');
const [addressPostalCode] = defineField('address.postalCode');

const onSubmit = handleSubmit(async (values) => {
  const { error } = await useCustomFetch('/api/auth/register', {
    errorKey: 'register',
    method: 'POST',
    body: values,
  });

  if (!error.value) {
    toast.add({
      severity: 'success',
      summary: 'Votre compte a été crée',
      detail:
        'Vous allez recevoir un email vous demandant de confirmer votre compte',
      life: 3000,
    });

    await navigateTo('/auth/connexion');
  }
});
</script>

<template>
  <form method="post" @submit.prevent="onSubmit">
    <AlertErrors for="register" />

    <div class="flex gap-4 mb-4">
      <Field
        id="firstname"
        label="Prénom"
        v-slot="{ id, hasError }"
        :error="errors.firstname"
      >
        <InputText
          v-model="firstname"
          :id="id"
          :invalid="hasError"
          autocomplete="given-name"
        />
      </Field>

      <Field
        id="lastname"
        label="Nom"
        v-slot="{ id, hasError }"
        :error="errors.lastname"
      >
        <InputText
          v-model="lastname"
          :id="id"
          :invalid="hasError"
          autocomplete="family-name"
        />
      </Field>
    </div>

    <Field
      id="email"
      label="Email"
      v-slot="{ id, hasError }"
      class="mb-4"
      :error="errors.email"
    >
      <InputText
        v-model="email"
        :id="id"
        :invalid="hasError"
        autocomplete="email"
      />
    </Field>

    <div class="flex gap-4 mb-4">
      <Field
        id="password"
        label="Mot de passe"
        v-slot="{ id, hasError }"
        :error="errors.password"
      >
        <InputText
          v-model="password"
          :id="id"
          :invalid="hasError"
          autocomplete="current-password"
          type="password"
        />
      </Field>

      <Field
        id="passwordConfirmation"
        label="Confirmation du mot de passe"
        v-slot="{ id, hasError }"
        :error="errors.passwordConfirmation"
      >
        <InputText
          v-model="passwordConfirmation"
          :id="id"
          :invalid="hasError"
          autocomplete="new-password"
          type="password"
        />
      </Field>
    </div>

    <div class="flex gap-4 mb-7">
      <Field
        id="line1"
        label="Adresse"
        v-slot="{ id, hasError }"
        :error="errors['address.line1']"
      >
        <InputText
          v-model="addressLine1"
          :id="id"
          :invalid="hasError"
          autocomplete="address-line1"
        />
      </Field>

      <Field
        id="line2"
        label="Complément d'adresse"
        v-slot="{ id, hasError }"
        :error="errors['address.line2']"
      >
        <InputText
          v-model="addressLine2"
          :id="id"
          :invalid="hasError"
          autocomplete="address-line2"
        />
      </Field>
    </div>

    <div class="flex gap-4 mb-7">
      <Field
        id="postalCode"
        label="Code postal"
        v-slot="{ id, hasError }"
        :error="errors['address.postalCode']"
      >
        <InputText
          v-model="addressPostalCode"
          :id="id"
          :invalid="hasError"
          autocomplete="postal-code"
        />
      </Field>

      <Field
        id="city"
        label="Ville"
        v-slot="{ id, hasError }"
        :error="errors['address.city']"
      >
        <InputText
          v-model="addressCity"
          :id="id"
          :invalid="hasError"
          autocomplete="address-level2"
        />
      </Field>
    </div>

    <div class="flex justify-between items-center gap-4 mt-6">
      <Button label="M'inscrire" type="submit" />

      <router-link to="/auth/connexion">
        <Button label="Je souhaite me connecter" link />
      </router-link>
    </div>
  </form>
</template>
