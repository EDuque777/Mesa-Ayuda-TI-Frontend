export const TICKET_STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED"] as const;
export const TICKET_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const TICKET_CATEGORIES = [
  "HARDWARE",
  "SOFTWARE",
  "NETWORK",
  "ACCESS",
  "EMAIL",
  "OTHER",
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdById?: string;
  createdByFullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketComment {
  id: string;
  ticketId?: string;
  content: string;
  createdById?: string;
  authorId?: string;
  authorName?: string;
  authorFullName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TicketHistoryItem {
  id: string;
  ticketId?: string;
  action?: string;
  field?: string;
  from?: string | null;
  to?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  createdById?: string;
  authorId?: string;
  actorId?: string;
  actorFullName: string;
  createdAt: string;
}

export interface TicketDetail extends Ticket {
  comments?: TicketComment[];
  history?: TicketHistoryItem[];
}

export interface TicketListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TicketListResponse {
  data: Ticket[];
  meta: TicketListMeta;
}

export type TicketKanbanResponse = Record<TicketStatus, Ticket[]>;

export interface TicketMetrics {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byCategory: Record<TicketCategory, number>;
  byPriority: Record<TicketPriority, number>;
}

export interface TicketFilters {
  status?: TicketStatus | "";
  priority?: TicketPriority | "";
  category?: TicketCategory | "";
  search?: string;
}

export interface TicketListQuery extends TicketFilters {
  page?: number;
  limit?: number;
}

export type TicketKanbanQuery = TicketListQuery;
export type TicketMetricsQuery = TicketListQuery;
export type TicketExportQuery = TicketListQuery;

export interface CreateTicketRequest {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

export type UpdateTicketRequest = Partial<CreateTicketRequest>;

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface AddTicketCommentRequest {
  content: string;
}

export interface ExportTicketsCsvResponse {
  csv: string;
  filename: string;
}
