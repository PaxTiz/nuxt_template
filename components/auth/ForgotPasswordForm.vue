<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import AlertErrors from '~/components/shared/form/AlertErrors.vue';
import Field from '~/components/shared/form/Field.vue';
import { authSchema } from '~/types';

const toast = useToast();
const { defineField, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(authSchema.forgotPassword),
});

const [email] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
  const { error } = await useCustomFetch('/api/auth/forgot-password', {
    errorKey: 'forgot_password',
    method: 'POST',
    body: values,
  });

  if (!error.value) {
    toast.add({
      severity: 'success',
      summary: 'Votre demande a été prise en compte',
      detail:
        'Un email vous a été envoyé contenant un lien permettant de réinitialiser votre mot de passe',
      life: 3000,
    });
  }
});
</script>

<template>
  <form method="post" @submit.prevent="onSubmit">
    <AlertErrors for="forgot_password" />

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
      <Button label="Envoyer un email" type="submit" />

      <router-link to="/auth/connexion">
        <Button label="Je souhaite me connecter" link />
      </router-link>
    </div>
  </form>
</template>
