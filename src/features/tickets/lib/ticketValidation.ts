import {
  TICKET_COMMENT_MAX_LENGTH,
  TICKET_DESCRIPTION_MAX_LENGTH,
  TICKET_SEARCH_MAX_LENGTH,
  TICKET_SUBJECT_MAX_LENGTH,
} from "./ticketConstants";

export const validateTicketForm = (subject: string, description: string) => {
  const cleanSubject = subject.trim();
  const cleanDescription = description.trim();

  if (!cleanSubject) {
    return "Ingresa el asunto del ticket.";
  }

  if (cleanSubject.length > TICKET_SUBJECT_MAX_LENGTH) {
    return `El asunto debe tener máximo ${TICKET_SUBJECT_MAX_LENGTH} caracteres.`;
  }

  if (!cleanDescription) {
    return "Ingresa la descripción del ticket.";
  }

  if (cleanDescription.length > TICKET_DESCRIPTION_MAX_LENGTH) {
    return `La descripción debe tener máximo ${TICKET_DESCRIPTION_MAX_LENGTH} caracteres.`;
  }

  return null;
};

export const validateComment = (content: string) => {
  const cleanContent = content.trim();

  if (!cleanContent) {
    return "Ingresa el comentario interno.";
  }

  if (cleanContent.length > TICKET_COMMENT_MAX_LENGTH) {
    return `El comentario debe tener máximo ${TICKET_COMMENT_MAX_LENGTH} caracteres.`;
  }

  return null;
};

export const normalizeSearch = (search: string) =>
  search.trim().slice(0, TICKET_SEARCH_MAX_LENGTH);
