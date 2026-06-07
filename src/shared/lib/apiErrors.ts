import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface NestErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

const API_ERROR_MESSAGES: Record<string, string> = {
  "Bad Request": "Revisa los datos enviados. Hay campos incompletos, campos extra o valores no válidos.",
  Unauthorized: "No tienes autorización para realizar esta acción.",
  "Passwords do not match": "Las contraseñas no coinciden.",
  "Email pending verification": "La cuenta está pendiente de verificación. Termina la verificación para poder ingresar.",
  "Email already registered": "Este correo ya está registrado. Inicia sesión o usa otro correo.",
  "Error sending verification email": "No pudimos enviar el correo de verificación. Intenta nuevamente en unos minutos.",
  "Invalid credentials": "El correo o la contraseña no son correctos.",
  "Email not verified": "El correo todavía no está verificado.",
  "Invalid verification data": "Los datos de verificación no son válidos.",
  "Email already verified": "Este correo ya está verificado.",
  "Verification code not found": "No encontramos un código de verificación activo.",
  "Verification code expired": "El código de verificación expiró.",
  "Invalid verification code": "El código de verificación no es correcto.",
  "Refresh token not found": "No encontramos una sesión activa.",
  "Invalid refresh token": "La sesión expiró o ya no es válida.",
  "Access token is required": "Debes iniciar sesión para continuar.",
  "Invalid access token": "Tu sesión no es válida. Inicia sesión nuevamente.",
  "Authenticated user is required": "No pudimos identificar al usuario autenticado. Inicia sesión nuevamente.",
  "The user does not exist.": "El usuario no existe.",
  "User does not exist": "El usuario no existe.",
  "User not found": "El usuario no existe.",
  "Ticket not found": "No encontramos el ticket solicitado.",
  "At least one ticket field is required": "Debes modificar al menos un campo del ticket.",
  "subject cannot be empty": "El asunto del ticket no puede estar vacío.",
  "description cannot be empty": "La descripción del ticket no puede estar vacía.",
  "content cannot be empty": "El comentario no puede estar vacío.",
};

const API_FIELD_LABELS: Record<string, string> = {
  accessToken: "token de acceso",
  category: "categoría",
  code: "código",
  confirmPassword: "confirmación de contraseña",
  content: "comentario",
  description: "descripción",
  email: "correo electrónico",
  firstName: "nombre",
  id: "identificador",
  lastName: "apellido",
  limit: "límite",
  newPassword: "nueva contraseña",
  page: "página",
  password: "contraseña",
  priority: "prioridad",
  refreshToken: "token de refresco",
  search: "búsqueda",
  status: "estado",
  subject: "asunto",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNestErrorResponse = (value: unknown): value is NestErrorResponse =>
  isRecord(value) &&
  (!("message" in value) ||
    typeof value.message === "string" ||
    (Array.isArray(value.message) &&
      value.message.every((item) => typeof item === "string")));

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  isRecord(error) && "status" in error;

const isSerializedError = (error: unknown): error is SerializedError =>
  isRecord(error) &&
  ("message" in error || "name" in error || "code" in error || "stack" in error);

const getFieldLabel = (field: string) => API_FIELD_LABELS[field] ?? field;

const getSpanishValidationMessage = (message: string) => {
  const propertyMatch = message.match(/^property (.+) should not exist$/i);

  if (propertyMatch) {
    return `El campo ${getFieldLabel(propertyMatch[1])} no está permitido.`;
  }

  const [field] = message.split(" ");
  const fieldLabel = getFieldLabel(field);

  if (message.match(/ must be an email$/i)) {
    return `El campo ${fieldLabel} debe ser un correo electrónico válido.`;
  }

  if (message.match(/ should not be empty$/i)) {
    return `El campo ${fieldLabel} no puede estar vacío.`;
  }

  if (message.match(/ must be a string$/i)) {
    return `El campo ${fieldLabel} debe ser texto.`;
  }

  if (message.match(/ must be an integer number$/i)) {
    return `El campo ${fieldLabel} debe ser un número entero.`;
  }

  if (message.match(/ must be a number conforming to the specified constraints$/i)) {
    return `El campo ${fieldLabel} debe ser un número válido.`;
  }

  const maxLengthMatch = message.match(/ must be shorter than or equal to (\d+) characters$/i);

  if (maxLengthMatch) {
    return `El campo ${fieldLabel} debe tener máximo ${maxLengthMatch[1]} caracteres.`;
  }

  const minLengthMatch = message.match(/ must be longer than or equal to (\d+) characters$/i);

  if (minLengthMatch) {
    return `El campo ${fieldLabel} debe tener mínimo ${minLengthMatch[1]} caracteres.`;
  }

  const minValueMatch = message.match(/ must not be less than (\d+)$/i);

  if (minValueMatch) {
    return `El campo ${fieldLabel} debe ser mayor o igual a ${minValueMatch[1]}.`;
  }

  const maxValueMatch = message.match(/ must not be greater than (\d+)$/i);

  if (maxValueMatch) {
    return `El campo ${fieldLabel} debe ser menor o igual a ${maxValueMatch[1]}.`;
  }

  const enumMatch = message.match(/ must be one of the following values: (.+)$/i);

  if (enumMatch) {
    return `El campo ${fieldLabel} debe ser uno de estos valores: ${enumMatch[1]}.`;
  }

  if (message.match(/ must match .+ regular expression$/i)) {
    if (field === "code") {
      return "El código debe tener exactamente 6 dígitos.";
    }

    return `El campo ${fieldLabel} no tiene el formato requerido.`;
  }

  return null;
};

const getSpanishApiMessage = (message: string) => {
  const normalizedMessage = message.trim();

  if (!normalizedMessage) {
    return normalizedMessage;
  }

  return (
    API_ERROR_MESSAGES[normalizedMessage] ??
    getSpanishValidationMessage(normalizedMessage) ??
    normalizedMessage
  );
};

const normalizeMessage = (message: string | string[]) =>
  Array.isArray(message)
    ? message.map(getSpanishApiMessage).join("\n")
    : getSpanishApiMessage(message);

const getSpanishTransportError = (error: FetchBaseQueryError) => {
  if (error.status === "FETCH_ERROR") {
    return "No pudimos conectar con el backend. Verifica que el servidor esté activo.";
  }

  if (error.status === "PARSING_ERROR") {
    return "No pudimos leer la respuesta del backend. Revisa el formato que devuelve el endpoint.";
  }

  if (error.status === "TIMEOUT_ERROR") {
    return "El backend tardó demasiado en responder. Intenta nuevamente.";
  }

  if (error.status === "CUSTOM_ERROR") {
    return "No pudimos completar la solicitud por un error inesperado.";
  }

  return null;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "No pudimos completar la solicitud. Intenta nuevamente.",
) => {
  if (isFetchBaseQueryError(error)) {
    const transportError = getSpanishTransportError(error);

    if (transportError) {
      return transportError;
    }

    if (isNestErrorResponse(error.data) && error.data.message) {
      return normalizeMessage(error.data.message);
    }

    if ("error" in error && typeof error.error === "string") {
      return getSpanishApiMessage(error.error);
    }
  }

  if (isSerializedError(error) && typeof error.message === "string") {
    return getSpanishApiMessage(error.message);
  }

  if (error instanceof Error) {
    return getSpanishApiMessage(error.message);
  }

  return fallback;
};
