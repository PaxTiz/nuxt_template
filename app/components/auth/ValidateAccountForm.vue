<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { authSchema } from '#shared/types';

const route = useRoute();
if (!route.query.token) {
  throw createError({ statusCode: 404 });
}

const toast = useToast();
const { defineField, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(authSchema.validateAccount),
  initialValues: { token: route.query.token as string },
});

const [email] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
  const { error } = await useCustomFetch('/api/auth/validate', {
    errorKey: 'validate_account',
    method: 'POST',
    body: values,
  });

  if (!error.value) {
    toast.add({
      severity: 'success',
      summary: 'Votre mot de passe a bien été activé',
      detail: 'Vous pouvez désormais vous connecter',
      life: 3000,
    });

    await navigateTo('/auth/connexion');
  }
});
</script>

<template>
  <form method="post" @submit.prevent="onSubmit">
    <AlertErrors for="validate_account" />

    <Field
      id="email"
      label="Email"
      v-slot="{ id, hasError }"
      class="mb-4"
      :error="errors.email"
    >
      <InputText v-model="email" :id="id" :invalid="hasError" />
    </Field>

    <div class="flex justify-between items-center gap-4 mt-6">
      <Button label="Activer mon compte" type="submit" />
    </div>
  </form>
</template>
