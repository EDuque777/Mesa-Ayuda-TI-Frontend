import {
  TICKET_CATEGORY_LABELS,
  TICKET_CATEGORY_STYLES,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_STYLES,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_STYLES,
} from "../lib/ticketConstants";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../types/ticket.types";

type TicketBadgeProps = {
  label: string;
  className: string;
};

function TicketBadge({ label, className }: TicketBadgeProps) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-extrabold ${className}`}
    >
      {label}
    </span>
  );
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <TicketBadge
      label={TICKET_STATUS_LABELS[status]}
      className={TICKET_STATUS_STYLES[status]}
    />
  );
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <TicketBadge
      label={TICKET_PRIORITY_LABELS[priority]}
      className={TICKET_PRIORITY_STYLES[priority]}
    />
  );
}

export function TicketCategoryBadge({ category }: { category: TicketCategory }) {
  return (
    <TicketBadge
      label={TICKET_CATEGORY_LABELS[category]}
      className={TICKET_CATEGORY_STYLES[category]}
    />
  );
}
