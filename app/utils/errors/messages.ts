export const cleanErrors = (key: string) =>
  ({
    email_already_in_use: 'Votre adresse email est déjà utilisée',
    invalid_credentials: 'Email ou mot de passe invalide',
    email_not_found: "L'adresse email n'a pas été trouvée",
    account_already_active: 'Votre compte est déjà actif',
    account_not_enabled: "Votre compte n'a été activé",
    invalid_token: 'Le code de validation est invalide',

    reset_password_token_not_found: 'Le code de validation est invalide',
    reset_password_invalid_email_for_token:
      "L'adresse email ne correspond pas au code de validation",
  })[key] ?? "Une erreur inconnue s'est produite";
