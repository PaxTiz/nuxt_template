<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import AlertErrors from '~/components/shared/form/AlertErrors.vue';
import Field from '~/components/shared/form/Field.vue';
import type { User } from '~/server/database';
import { userRoles, usersSchema } from '~/types';

const props = defineProps<{ user: User }>();

const toast = useToast();
const { errors, defineField, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(usersSchema.update),
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
  const { error } = await useCustomFetch(`/api/users/${props.user.id}`, {
    errorKey: 'update_user_form',
    method: 'PATCH',
    body: values,
  });

  if (!error.value) {
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
  <Card :pt="{ root: { class: 'shadow-none rounded-b-lg' } }">
    <template #content>
      <form id="update-user" method="post" @submit.prevent="onSubmit">
        <AlertErrors for="update_user_form" />

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
            help-title="A propos des rôles"
            :error="errors.role"
          >
            <template #default="{ id, hasError }">
              <Select
                v-model="role"
                :input-id="id"
                :options="userRoles.options"
                :invalid="hasError"
              />
            </template>

            <template #help>
              <ul class="prose m-0">
                <li>
                  <b>USER</b> : rôle de base des utilisateurs de l'application
                </li>
                <li>
                  <b>ADMIN</b> : rôle pour les personnes en charge de
                  l'administration du site
                </li>
                <li>
                  <b>DEVELOPER</b> : rôle réservé aux développeurs ayant les
                  droits admin ainsi que des informations supplémentaires en cas
                  de problème
                </li>
              </ul>
            </template>
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
