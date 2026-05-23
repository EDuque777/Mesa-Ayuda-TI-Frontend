export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
export const NAME_MAX_LENGTH = 80;
export const EMAIL_MAX_LENGTH = 150;

export interface PasswordRequirement {
  id: string;
  label: string;
  isValid: boolean;
}

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
  email.trim().length <= EMAIL_MAX_LENGTH;

export const isSixDigitCode = (code: string) => /^\d{6}$/.test(code);

export const getPasswordRequirements = (
  password: string,
): PasswordRequirement[] => [
  {
    id: "lowercase",
    label: "Una letra minúscula",
    isValid: /[a-z]/.test(password),
  },
  {
    id: "uppercase",
    label: "Una letra mayúscula",
    isValid: /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "Un número",
    isValid: /\d/.test(password),
  },
  {
    id: "special",
    label: "Un carácter especial",
    isValid: /[^A-Za-z0-9]/.test(password),
  },
  {
    id: "length",
    label: `Entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres`,
    isValid:
      password.length >= PASSWORD_MIN_LENGTH &&
      password.length <= PASSWORD_MAX_LENGTH,
  },
];

export const isValidPassword = (password: string) =>
  getPasswordRequirements(password).every((requirement) => requirement.isValid);

export const passwordsMatch = (password: string, confirmPassword: string) =>
  password.length > 0 && password === confirmPassword;
