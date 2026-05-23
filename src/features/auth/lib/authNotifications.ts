"use client";

import {
  notifyAction,
  notifyError,
  notifySuccess,
  notifyWarning,
} from "@/shared/ui/toasts/notify";

interface AuthToastCopy {
  title: string;
  description: string;
}

export type AuthErrorContext =
  | "signIn"
  | "signUp"
  | "verifySignInCode"
  | "verifySignUpCode"
  | "resendVerificationCode"
  | "forgotPassword"
  | "resetPassword"
  | "logOut";

export type AuthSuccessContext =
  | "signInCodeSent"
  | "signInVerified"
  | "signUpCreated"
  | "signUpVerified"
  | "verificationCodeResent"
  | "forgotPasswordCodeSent"
  | "passwordReset"
  | "loggedOut";

const SUCCESS_TOASTS: Record<AuthSuccessContext, AuthToastCopy> = {
  signInCodeSent: {
    title: "Código de acceso enviado",
    description:
      "Revisa tu correo e ingresa el código de seguridad para completar el inicio de sesión.",
  },
  signInVerified: {
    title: "Inicio de sesión confirmado",
    description:
      "Validamos tu código correctamente. Te llevaremos al inicio en unos segundos.",
  },
  signUpCreated: {
    title: "Registro creado correctamente",
    description:
      "Te enviamos un código de verificación para activar tu cuenta.",
  },
  signUpVerified: {
    title: "Cuenta verificada",
    description:
      "Tu correo fue confirmado correctamente. Te llevaremos al inicio en unos segundos.",
  },
  verificationCodeResent: {
    title: "Código de verificación enviado",
    description:
      "Generamos un nuevo código. Revisa tu correo y usa el más reciente.",
  },
  forgotPasswordCodeSent: {
    title: "Código de recuperación enviado",
    description:
      "Si el correo está registrado, recibirás un código para restablecer tu contraseña.",
  },
  passwordReset: {
    title: "Contraseña actualizada",
    description:
      "Tu contraseña fue restablecida correctamente. Ya puedes iniciar sesión con tu nueva clave.",
  },
  loggedOut: {
    title: "Sesión cerrada",
    description:
      "Cerraste sesión correctamente. Te llevaremos al inicio de sesión en unos segundos.",
  },
};

const CONTEXT_FALLBACKS: Record<AuthErrorContext, AuthToastCopy> = {
  signIn: {
    title: "Problema al iniciar sesión",
    description:
      "No pudimos validar tus credenciales. Revisa tu correo y contraseña e intenta nuevamente.",
  },
  signUp: {
    title: "Problema al crear la cuenta",
    description:
      "Revisa los datos del formulario y vuelve a intentar el registro.",
  },
  verifySignInCode: {
    title: "Problema al verificar el acceso",
    description:
      "Revisa el código de seguridad enviado a tu correo e intenta nuevamente.",
  },
  verifySignUpCode: {
    title: "Problema al verificar la cuenta",
    description:
      "Revisa el código de seguridad enviado a tu correo e intenta nuevamente.",
  },
  resendVerificationCode: {
    title: "Problema al reenviar el código",
    description:
      "No pudimos generar un nuevo código de verificación. Intenta nuevamente.",
  },
  forgotPassword: {
    title: "Problema al solicitar el código",
    description:
      "Revisa que el correo tenga un formato válido e intenta nuevamente.",
  },
  resetPassword: {
    title: "Problema al restablecer la contraseña",
    description:
      "Revisa el código y las contraseñas ingresadas antes de intentarlo otra vez.",
  },
  logOut: {
    title: "Problema al cerrar sesión",
    description:
      "No pudimos confirmar el cierre con el servidor, pero limpiaremos la sesión local.",
  },
};

const BUSINESS_ERROR_TOASTS: Record<string, AuthToastCopy> = {
  "Invalid credentials": {
    title: "Problema al iniciar sesión",
    description:
      "Revisa que tu correo y contraseña sean correctos antes de intentarlo nuevamente.",
  },
  "Email not verified": {
    title: "Correo pendiente de verificación",
    description:
      "Verifica tu correo electrónico antes de iniciar sesión en el portal.",
  },
  "Email pending verification": {
    title: "Cuenta pendiente de verificación",
    description:
      "Esta cuenta todavía no ha sido verificada. Termina la verificación para poder ingresar.",
  },
  "Email already registered": {
    title: "Correo ya registrado",
    description:
      "Este correo ya tiene una cuenta. Inicia sesión o usa un correo diferente.",
  },
  "Passwords do not match": {
    title: "Contraseñas diferentes",
    description:
      "Confirma que ambos campos tengan exactamente la misma contraseña.",
  },
  "Invalid verification data": {
    title: "Datos de verificación inválidos",
    description:
      "Revisa el correo y el código de seguridad antes de continuar.",
  },
  "Email already verified": {
    title: "Correo ya verificado",
    description:
      "Tu cuenta ya estaba confirmada. Puedes iniciar sesión con normalidad.",
  },
  "Verification code not found": {
    title: "Código no encontrado",
    description:
      "Solicita un nuevo código y usa el más reciente que llegue a tu correo.",
  },
  "Invalid verification code": {
    title: "Código incorrecto",
    description:
      "Revisa los 6 dígitos del código de seguridad e intenta nuevamente.",
  },
  "Verification code expired": {
    title: "Código expirado",
    description:
      "El código ya no está vigente. Solicita uno nuevo para continuar.",
  },
  "Refresh token not found": {
    title: "Sesión no activa",
    description:
      "Inicia sesión nuevamente para acceder de forma segura al portal.",
  },
  "Invalid refresh token": {
    title: "Sesión expirada",
    description:
      "Tu sesión ya no es válida. Inicia sesión nuevamente para continuar.",
  },
  "Error sending verification email": {
    title: "No pudimos enviar el correo",
    description:
      "Hubo un problema enviando el código de seguridad. Intenta nuevamente en unos minutos.",
  },
};

const VALIDATION_ERROR_TOASTS: Record<string, AuthToastCopy> = {
  "Ingresa tu correo y contraseña.": {
    title: "Campos incompletos",
    description:
      "Ingresa tu correo electrónico y contraseña para iniciar sesión.",
  },
  "Completa todos los campos para crear la cuenta.": {
    title: "Campos incompletos",
    description:
      "Completa la información requerida para crear tu cuenta.",
  },
  "Las contraseñas no coinciden.": {
    title: "Contraseñas diferentes",
    description:
      "Confirma que ambos campos tengan exactamente la misma contraseña.",
  },
  "El código debe tener 6 dígitos.": {
    title: "Código incompleto",
    description:
      "Ingresa los 6 dígitos del código de seguridad enviado a tu correo.",
  },
};

const normalizeErrorMessage = (message: string) => message.trim();

const includes = (message: string, searchValue: string) =>
  normalizeErrorMessage(message).toLowerCase().includes(searchValue);

export const isEmailVerificationPendingError = (message: string) => {
  const normalizedMessage = normalizeErrorMessage(message);

  return (
    normalizedMessage === "Email not verified" ||
    normalizedMessage === "Email pending verification"
  );
};

export const getAuthErrorToast = (
  context: AuthErrorContext,
  message: string,
): AuthToastCopy => {
  const normalizedMessage = normalizeErrorMessage(message);

  if (BUSINESS_ERROR_TOASTS[normalizedMessage]) {
    return BUSINESS_ERROR_TOASTS[normalizedMessage];
  }

  if (VALIDATION_ERROR_TOASTS[normalizedMessage]) {
    return VALIDATION_ERROR_TOASTS[normalizedMessage];
  }

  if (includes(normalizedMessage, "correo válido")) {
    return {
      title: "Correo no válido",
      description:
        "Revisa que el correo tenga un formato válido antes de continuar.",
    };
  }

  if (includes(normalizedMessage, "máximo") || includes(normalizedMessage, "max")) {
    return {
      title: "Información demasiado extensa",
      description:
        "Revisa la longitud de los campos y ajusta la información solicitada.",
    };
  }

  if (includes(normalizedMessage, "contraseña todavía no cumple")) {
    return {
      title: "Contraseña no válida",
      description:
        "Asegúrate de incluir mayúscula, minúscula, número, carácter especial y entre 8 y 72 caracteres.",
    };
  }

  if (includes(normalizedMessage, "email must be an email")) {
    return {
      title: "Correo no válido",
      description:
        "Ingresa un correo electrónico válido para continuar.",
    };
  }

  return CONTEXT_FALLBACKS[context];
};

export const notifyAuthSuccess = (context: AuthSuccessContext) => {
  const toast = SUCCESS_TOASTS[context];
  notifySuccess(toast.description, toast.title);
};

export const notifyAuthError = (
  context: AuthErrorContext,
  message: string,
) => {
  const toast = getAuthErrorToast(context, message);
  notifyError(toast.description, toast.title);
};

export const notifyEmailVerificationPending = (onConfirm: () => void) => {
  notifyAction({
    title: "Cuenta pendiente de verificación",
    description:
      "Esta cuenta todavía no ha sido verificada. Para ingresar, termina la verificación con un nuevo código.",
    buttonTitle: "Terminar de verificar",
    onClick: onConfirm,
  });
};

export const notifySessionWarning = () => {
  notifyWarning(
    "Inicia sesión nuevamente para acceder de forma segura al portal.",
    "Sesión no activa",
  );
};

export const notifyBackendUnavailable = () => {
  notifyWarning(
    "No pudimos confirmar la conexión con el servidor. Verifica que el backend esté activo.",
    "Backend no disponible",
  );
};
