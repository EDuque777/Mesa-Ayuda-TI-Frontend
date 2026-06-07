import {
  TICKET_CATEGORY_LABELS,
  TICKET_FIELD_LABELS,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from "./ticketConstants";
import type {
  TicketCategory,
  TicketHistoryItem,
  TicketPriority,
  TicketStatus,
} from "../types/ticket.types";

const dateTimeFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
});

const TICKET_HISTORY_ACTION_LABELS: Record<string, string> = {
  CREATED: "Ticket creado",
  UPDATED: "Ticket actualizado",
  STATUS_CHANGED: "Estado actualizado",
  COMMENT_ADDED: "Comentario agregado",
  COMMENT_CREATED: "Comentario agregado",
  COMMENT_UPDATED: "Comentario actualizado",
};

export const formatTicketDateTime = (value?: string | null) => {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateTimeFormatter.format(date);
};

export const formatTicketDate = (value?: string | null) => {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
};

export const formatTicketValue = (field: string | undefined, value?: string | null) => {
  if (!value) {
    return "vacío";
  }

  if (field === "status" && value in TICKET_STATUS_LABELS) {
    return TICKET_STATUS_LABELS[value as TicketStatus];
  }

  if (field === "priority" && value in TICKET_PRIORITY_LABELS) {
    return TICKET_PRIORITY_LABELS[value as TicketPriority];
  }

  if (field === "category" && value in TICKET_CATEGORY_LABELS) {
    return TICKET_CATEGORY_LABELS[value as TicketCategory];
  }

  return value;
};

export const formatHistoryAction = (action?: string | null) => {
  if (!action) {
    return null;
  }

  const normalizedAction = action.trim();

  if (!normalizedAction) {
    return null;
  }

  if (TICKET_HISTORY_ACTION_LABELS[normalizedAction]) {
    return TICKET_HISTORY_ACTION_LABELS[normalizedAction];
  }

  return normalizedAction
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\p{L}/u, (letter) => letter.toUpperCase());
};

export const getHistoryDescription = (item: TicketHistoryItem) => {
  const fieldLabel = item.field
    ? TICKET_FIELD_LABELS[item.field] ?? item.field
    : null;
  const previousValue = item.oldValue ?? item.from ?? null;
  const nextValue = item.newValue ?? item.to ?? null;

  if (fieldLabel && (previousValue !== null || nextValue !== null)) {
    return `${fieldLabel}: ${formatTicketValue(item.field, previousValue)} -> ${formatTicketValue(item.field, nextValue)}`;
  }

  if (item.action) {
    return formatHistoryAction(item.action) ?? item.action;
  }

  if (fieldLabel) {
    return `${fieldLabel} actualizado`;
  }

  return "Cambio registrado en el ticket";
};
