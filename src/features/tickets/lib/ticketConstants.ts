import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../types/ticket.types";
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from "../types/ticket.types";

export {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  NEW: "Nuevo",
  IN_PROGRESS: "En proceso",
  RESOLVED: "Resuelto",
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
  NETWORK: "Red",
  ACCESS: "Accesos",
  EMAIL: "Correo",
  OTHER: "Otro",
};

export const TICKET_STATUS_HELP_TEXT: Record<TicketStatus, string> = {
  NEW: "Casos recibidos que esperan atencion.",
  IN_PROGRESS: "Casos que ya estan siendo trabajados.",
  RESOLVED: "Casos cerrados o solucionados.",
};

export const TICKET_STATUS_STYLES: Record<TicketStatus, string> = {
  NEW: "border-sky-200 bg-sky-50 text-sky-700",
  IN_PROGRESS: "border-amber-200 bg-amber-50 text-amber-700",
  RESOLVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export const TICKET_PRIORITY_STYLES: Record<TicketPriority, string> = {
  LOW: "border-slate-200 bg-slate-50 text-slate-600",
  MEDIUM: "border-cyan-200 bg-cyan-50 text-cyan-700",
  HIGH: "border-orange-200 bg-orange-50 text-orange-700",
  URGENT: "border-rose-200 bg-rose-50 text-rose-700",
};

export const TICKET_CATEGORY_STYLES: Record<TicketCategory, string> = {
  HARDWARE: "border-indigo-200 bg-indigo-50 text-indigo-700",
  SOFTWARE: "border-violet-200 bg-violet-50 text-violet-700",
  NETWORK: "border-teal-200 bg-teal-50 text-teal-700",
  ACCESS: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  EMAIL: "border-blue-200 bg-blue-50 text-blue-700",
  OTHER: "border-zinc-200 bg-zinc-50 text-zinc-700",
};

export const TICKET_FIELD_LABELS: Record<string, string> = {
  subject: "Asunto",
  description: "Descripción",
  category: "Categoría",
  priority: "Prioridad",
  status: "Estado",
};

export const TICKET_SUBJECT_MAX_LENGTH = 120;
export const TICKET_DESCRIPTION_MAX_LENGTH = 5000;
export const TICKET_SEARCH_MAX_LENGTH = 120;
export const TICKET_COMMENT_MAX_LENGTH = 2000;
export const TICKET_PAGE_LIMIT = 20;
