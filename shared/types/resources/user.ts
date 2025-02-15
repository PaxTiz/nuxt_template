export type UserResource = {
  id: string;

  firstname: string;

  lastname: string;

  email: string;

  address: {
    line1: string;

    line2: string | null;

    postalCode: string;

    city: string;
  };

  isEnabled: boolean;

  role: UserRole;

  createdAt: Date | string;

  lastLoginAt: Date | string;
};
