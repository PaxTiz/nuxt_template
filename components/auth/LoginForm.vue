<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import AlertErrors from '~/components/shared/form/AlertErrors.vue';
import Field from '~/components/shared/form/Field.vue';
import { loginSchema } from '~/types';

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

const { setErrors } = useFormErrors('login');
const [email] = defineField('email');
const [password] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  const { error } = await useCustomFetch('/api/auth/login', {
    method: 'POST',
    watch: false,
    body: values,
  });

  if (error) {
    setErrors(error);
  } else {
    await navigateTo('/');
  }
});
</script>

<template>
  <form method="post" @submit.prevent="onSubmit">
    <AlertErrors for="login" />

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
        type="password"
        autocomplete="current-password"
      />
    </Field>

    <div class="flex justify-between items-center gap-4 mt-6">
      <Button label="Me connecter" type="submit" />

      <router-link to="/auth/mot-de-passe-oublie">
        <Button label="J'ai oublié mon mot de passe" link />
      </router-link>
    </div>
  </form>

  <Divider class="mt-12 mb-6" />

  <router-link to="/auth/inscription">
    <Button label="Je n'ai pas encore de compte" class="w-full" outlined />
  </router-link>
</template>
