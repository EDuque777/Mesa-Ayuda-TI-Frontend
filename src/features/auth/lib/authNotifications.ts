"use client";

import {
  notifyAction,
  notifyError,
  notifySuccess,
  notifySuccessAndWait,
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
    description: "Validamos tu código correctamente.",
  },
  signUpCreated: {
    title: "Registro creado correctamente",
    description:
      "Te enviamos un código de verificación para activar tu cuenta.",
  },
  signUpVerified: {
    title: "Cuenta verificada",
    description: "Tu correo fue confirmado correctamente.",
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
    description: "Cerraste sesión correctamente.",
  },
};

const CONTEXT_FALLBACKS: Record<AuthErrorContext, AuthToastCopy> = {
  signIn: {
    title: "No se pudo iniciar sesión",
    description:
      "Revisa tu correo y contraseña antes de intentarlo nuevamente.",
  },
  signUp: {
    title: "No se pudo crear la cuenta",
    description:
      "Revisa los datos del formulario y vuelve a intentar el registro.",
  },
  verifySignInCode: {
    title: "No se pudo verificar el acceso",
    description:
      "Revisa el código de seguridad enviado a tu correo e intenta nuevamente.",
  },
  verifySignUpCode: {
    title: "No se pudo verificar la cuenta",
    description:
      "Revisa el código de seguridad enviado a tu correo e intenta nuevamente.",
  },
  resendVerificationCode: {
    title: "No se pudo reenviar el código",
    description:
      "No pudimos generar un nuevo código de verificación. Intenta nuevamente.",
  },
  forgotPassword: {
    title: "No se pudo solicitar el código",
    description:
      "Revisa que el correo tenga un formato válido e intenta nuevamente.",
  },
  resetPassword: {
    title: "No se pudo restablecer la contraseña",
    description:
      "Revisa el código y las contraseñas ingresadas antes de intentarlo otra vez.",
  },
  logOut: {
    title: "No se pudo cerrar sesión",
    description:
      "No pudimos confirmar el cierre con el servidor. Intenta nuevamente.",
  },
};

const AUTH_ERROR_TOASTS: Record<string, AuthToastCopy> = {
  "Invalid credentials": {
    title: "Credenciales incorrectas",
    description: "El correo o la contraseña no son correctos.",
  },
  "El correo o la contrasena no son correctos.": {
    title: "Credenciales incorrectas",
    description: "El correo o la contraseña no son correctos.",
  },
  "Passwords do not match": {
    title: "Contraseñas diferentes",
    description: "Confirma que ambos campos tengan la misma contraseña.",
  },
  "Las contrasenas no coinciden.": {
    title: "Contraseñas diferentes",
    description: "Confirma que ambos campos tengan la misma contraseña.",
  },
  "Las contraseñas no coinciden.": {
    title: "Contraseñas diferentes",
    description: "Confirma que ambos campos tengan la misma contraseña.",
  },
  "Email pending verification": {
    title: "Cuenta pendiente de verificación",
    description:
      "Termina la verificación de tu cuenta para poder ingresar.",
  },
  "La cuenta esta pendiente de verificacion. Termina la verificacion para poder ingresar.": {
    title: "Cuenta pendiente de verificación",
    description:
      "Termina la verificación de tu cuenta para poder ingresar.",
  },
  "Email already registered": {
    title: "Correo ya registrado",
    description:
      "Este correo ya tiene una cuenta. Inicia sesión o usa otro correo.",
  },
  "Este correo ya esta registrado. Inicia sesion o usa otro correo.": {
    title: "Correo ya registrado",
    description:
      "Este correo ya tiene una cuenta. Inicia sesión o usa otro correo.",
  },
  "Error sending verification email": {
    title: "No pudimos enviar el correo",
    description:
      "Hubo un problema enviando el código de seguridad. Intenta nuevamente en unos minutos.",
  },
  "No pudimos enviar el correo de verificacion. Intenta nuevamente en unos minutos.": {
    title: "No pudimos enviar el correo",
    description:
      "Hubo un problema enviando el código de seguridad. Intenta nuevamente en unos minutos.",
  },
  "Email not verified": {
    title: "Correo pendiente de verificación",
    description: "Verifica tu correo electrónico antes de iniciar sesión.",
  },
  "El correo todavia no esta verificado.": {
    title: "Correo pendiente de verificación",
    description: "Verifica tu correo electrónico antes de iniciar sesión.",
  },
  "Invalid verification data": {
    title: "Datos de verificación inválidos",
    description:
      "Revisa el correo y el código de seguridad antes de continuar.",
  },
  "Los datos de verificacion no son validos.": {
    title: "Datos de verificación inválidos",
    description:
      "Revisa el correo y el código de seguridad antes de continuar.",
  },
  "Email already verified": {
    title: "Correo ya verificado",
    description:
      "Tu cuenta ya estaba confirmada. Puedes iniciar sesión con normalidad.",
  },
  "Este correo ya esta verificado.": {
    title: "Correo ya verificado",
    description:
      "Tu cuenta ya estaba confirmada. Puedes iniciar sesión con normalidad.",
  },
  "Verification code not found": {
    title: "Código no encontrado",
    description: "Solicita un nuevo código y usa el más reciente.",
  },
  "No encontramos un codigo de verificacion activo.": {
    title: "Código no encontrado",
    description: "Solicita un nuevo código y usa el más reciente.",
  },
  "Verification code expired": {
    title: "Código expirado",
    description: "Solicita un nuevo código de verificación para continuar.",
  },
  "El codigo de verificacion expiro.": {
    title: "Código expirado",
    description: "Solicita un nuevo código de verificación para continuar.",
  },
  "Invalid verification code": {
    title: "Código incorrecto",
    description: "Revisa los 6 dígitos del código e intenta nuevamente.",
  },
  "El codigo de verificacion no es correcto.": {
    title: "Código incorrecto",
    description: "Revisa los 6 dígitos del código e intenta nuevamente.",
  },
  "Refresh token not found": {
    title: "Sesión no activa",
    description: "Inicia sesión nuevamente para continuar.",
  },
  "No encontramos una sesion activa.": {
    title: "Sesión no activa",
    description: "Inicia sesión nuevamente para continuar.",
  },
  "Invalid refresh token": {
    title: "Sesión expirada",
    description: "Tu sesión ya no es válida. Inicia sesión nuevamente.",
  },
  "La sesion expiro o ya no es valida.": {
    title: "Sesión expirada",
    description: "Tu sesión ya no es válida. Inicia sesión nuevamente.",
  },
  "Access token is required": {
    title: "Sesión requerida",
    description: "Debes iniciar sesión para continuar.",
  },
  "Debes iniciar sesion para continuar.": {
    title: "Sesión requerida",
    description: "Debes iniciar sesión para continuar.",
  },
  "Invalid access token": {
    title: "Sesión inválida",
    description: "Tu sesión no es válida. Inicia sesión nuevamente.",
  },
  "Tu sesion no es valida. Inicia sesion nuevamente.": {
    title: "Sesión inválida",
    description: "Tu sesión no es válida. Inicia sesión nuevamente.",
  },
  "Authenticated user is required": {
    title: "Usuario no autenticado",
    description:
      "No pudimos identificar al usuario autenticado. Inicia sesión nuevamente.",
  },
  "No pudimos identificar al usuario autenticado. Inicia sesion nuevamente.": {
    title: "Usuario no autenticado",
    description:
      "No pudimos identificar al usuario autenticado. Inicia sesión nuevamente.",
  },
  "The user does not exist.": {
    title: "Usuario no encontrado",
    description: "El usuario no existe.",
  },
  "User does not exist": {
    title: "Usuario no encontrado",
    description: "El usuario no existe.",
  },
  "User not found": {
    title: "Usuario no encontrado",
    description: "El usuario no existe.",
  },
  "Ingresa tu correo y contraseña.": {
    title: "Campos incompletos",
    description: "Ingresa tu correo y contraseña.",
  },
  "Completa todos los campos para crear la cuenta.": {
    title: "Campos incompletos",
    description: "Completa todos los campos para crear la cuenta.",
  },
  "El código debe tener 6 dígitos.": {
    title: "Código incompleto",
    description: "El código debe tener 6 dígitos.",
  },
};

const normalizeErrorMessage = (message: string) => message.trim();

const getAuthErrorToast = (
  context: AuthErrorContext,
  message: string,
): AuthToastCopy => {
  const normalizedMessage = normalizeErrorMessage(message);

  if (!normalizedMessage) {
    return CONTEXT_FALLBACKS[context];
  }

  return (
    AUTH_ERROR_TOASTS[normalizedMessage] ?? {
      title: CONTEXT_FALLBACKS[context].title,
      description: normalizedMessage,
    }
  );
};

export const isEmailVerificationPendingError = (message: string) => {
  const normalizedMessage = normalizeErrorMessage(message);

  return (
    normalizedMessage === "Email not verified" ||
    normalizedMessage === "Email pending verification" ||
    normalizedMessage === "El correo todavia no esta verificado." ||
    normalizedMessage ===
      "La cuenta esta pendiente de verificacion. Termina la verificacion para poder ingresar."
  );
};

export const notifyAuthSuccess = (context: AuthSuccessContext) => {
  const toast = SUCCESS_TOASTS[context];
  return notifySuccess(toast.description, toast.title);
};

export const notifyAuthSuccessAndWait = (context: AuthSuccessContext) => {
  const toast = SUCCESS_TOASTS[context];
  return notifySuccessAndWait(toast.description, toast.title);
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
      "Esta cuenta todavía no ha sido verificada. Termina la verificación con un nuevo código para poder ingresar.",
    buttonTitle: "Verificar cuenta",
    onClick: onConfirm,
  });
};

export const notifySessionWarning = () => {
  notifyWarning(
    "Inicia sesión nuevamente para acceder de forma segura.",
    "Sesión no activa",
  );
};

export const notifyBackendUnavailable = () => {
  notifyWarning(
    "No pudimos confirmar la conexión con el servidor. Verifica que el backend esté activo.",
    "Backend no disponible",
  );
};
