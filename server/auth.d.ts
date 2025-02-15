import { UserResource } from '~~/shared/types';

declare module '#auth-utils' {
  interface User extends UserResource {}

  interface UserSession {}
}

export {};
