<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import AlertErrors from '~/components/shared/form/AlertErrors.vue';
import Field from '~/components/shared/form/Field.vue';
import type { User } from '~/server/database';
import { adminUsers, userRoles } from '~/types';

const props = defineProps<{ user: User }>();

const toast = useToast();
const { setErrors, reset } = useFormErrors('user_form');
const { errors, defineField, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(adminUsers.update),
  initialValues: {
    firstname: props.user.firstname,
    lastname: props.user.lastname,
    email: props.user.email,
    address: {
      line1: props.user.addressLine1,
      line2: props.user.addressLine2,
      postalCode: props.user.addressPostalCode ?? undefined,
      city: props.user.addressCity,
    },
    isEnabled: props.user.isEnabled,
    role: props.user.role,
  },
});

const [firstname] = defineField('firstname');
const [lastname] = defineField('lastname');
const [email] = defineField('email');
const [addressLine1] = defineField('address.line1');
const [addressLine2] = defineField('address.line1');
const [addressPostalCode] = defineField('address.postalCode');
const [addressCity] = defineField('address.city');
const [role] = defineField('role');
const [isEnabled] = defineField('isEnabled');

const onSubmit = handleSubmit(async (values) => {
  reset();
  const { error } = await useCustomFetch(`/api/admin/users/${props.user.id}`, {
    method: 'PATCH',
    body: values,
  });

  if (error) {
    setErrors(error);
  } else {
    toast.add({
      severity: 'success',
      summary: 'Action réussie',
      detail: "L'utilisateur a bien été modifié.",
      life: 3000,
    });
  }
});
</script>

<template>
  <Card
    :pt="{ root: { class: 'shadow-none border border-solid border-gray-200' } }"
  >
    <template #content>
      <form id="update-user" method="post" @submit.prevent="onSubmit">
        <AlertErrors for="user_form" />

        <div class="flex gap-4 mb-6">
          <Field
            id="firstname"
            label="Prénom"
            v-slot="{ id, hasError }"
            :error="errors.firstname"
          >
            <InputText v-model="firstname" :id="id" :invalid="hasError" />
          </Field>

          <Field
            id="lastname"
            label="Nom"
            v-slot="{ id, hasError }"
            :error="errors.lastname"
          >
            <InputText v-model="lastname" :id="id" :invalid="hasError" />
          </Field>

          <Field
            id="email"
            label="Email"
            v-slot="{ id, hasError }"
            :error="errors.email"
          >
            <InputText v-model="email" :id="id" :invalid="hasError" />
          </Field>
        </div>

        <div class="flex gap-4 mb-6">
          <Field
            id="address"
            label="Adresse"
            v-slot="{ id, hasError }"
            :error="errors['address.line1']"
          >
            <InputText v-model="addressLine1" :id="id" :invalid="hasError" />
          </Field>

          <Field
            id="addressComplement"
            label="Complément d'adresse"
            v-slot="{ id, hasError }"
            :error="errors['address.line2']"
          >
            <InputText v-model="addressLine2" :id="id" :invalid="hasError" />
          </Field>
        </div>

        <div class="flex gap-4 mb-6">
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
            />
          </Field>

          <Field
            id="city"
            label="Ville"
            v-slot="{ id, hasError }"
            :error="errors['address.city']"
          >
            <InputText v-model="addressCity" :id="id" :invalid="hasError" />
          </Field>
        </div>

        <div class="flex gap-4">
          <Field
            id="role"
            label="Rôle"
            v-slot="{ id, hasError }"
            :error="errors.role"
          >
            <Select
              v-model="role"
              :input-id="id"
              :options="userRoles.options"
              :invalid="hasError"
            />
          </Field>

          <Field
            id="isEnabled"
            label="Compte activé ?"
            v-slot="{ id, hasError }"
            :error="errors.isEnabled"
          >
            <SelectButton
              v-model="isEnabled"
              :input-id="id"
              :options="[
                { label: 'Oui', value: true },
                { label: 'Non', value: false },
              ]"
              :invalid="hasError"
              option-label="label"
              option-value="value"
            />
          </Field>
        </div>
      </form>
    </template>

    <template #footer>
      <Button
        type="submit"
        form="update-user"
        label="Modifier"
        class="mt-6"
        :loading="isSubmitting"
      >
        <template #icon>
          <Icon name="lucide:edit-3" />
        </template>
      </Button>
    </template>
  </Card>
</template>

<style lang="scss" scoped></style>
