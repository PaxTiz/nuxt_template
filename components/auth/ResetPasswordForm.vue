<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import AlertErrors from '~/components/shared/form/AlertErrors.vue';
import Field from '~/components/shared/form/Field.vue';
import { authSchema } from '~/types';

const route = useRoute();
if (!route.query.token) {
  throw createError({ statusCode: 404 });
}

const toast = useToast();
const { defineField, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(authSchema.resetPassword),
  initialValues: { token: route.query.token as string },
});

const { setErrors } = useFormErrors('reset_password');
const [email] = defineField('email');
const [password] = defineField('password');
const [passwordConfirmation] = defineField('passwordConfirmation');

const onSubmit = handleSubmit(async (values) => {
  const { error } = await useCustomFetch('/api/auth/reset-password', {
    method: 'POST',
    body: values,
  });

  if (error) {
    setErrors(error);
  } else {
    toast.add({
      severity: 'success',
      summary: 'Votre mot de passe a bien été réinitialisé',
      detail:
        'Vous pouvez désormais vous connecter avec votre nouveau mot de passe',
      life: 3000,
    });

    await navigateTo('/auth/connexion');
  }
});
</script>

<template>
  <form method="post" @submit.prevent="onSubmit">
    <AlertErrors for="reset_password" />

    <Field
      id="email"
      label="Email"
      v-slot="{ id, hasError }"
      class="mb-4"
      :error="errors.email"
    >
      <InputText v-model="email" :id="id" :invalid="hasError" />
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
          type="password"
        />
      </Field>
    </div>

    <div class="flex justify-between items-center gap-4 mt-6">
      <Button label="Modifier" type="submit" />
    </div>
  </form>
</template>
