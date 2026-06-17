"use client";

import { useRouter } from "next/navigation";
import { useState, type DragEvent } from "react";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { notifyError, notifySuccess } from "@/shared/ui/toasts/notify";
import {
  TICKET_STATUSES,
  TICKET_STATUS_HELP_TEXT,
  TICKET_STATUS_LABELS,
} from "../lib/ticketConstants";
import { formatTicketDate } from "../lib/ticketFormatters";
import type {
  Ticket,
  TicketKanbanResponse,
  TicketStatus,
} from "../types/ticket.types";
import { useUpdateTicketStatusMutation } from "../api/ticketsApi";
import {
  TicketCategoryBadge,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "./TicketBadge";
import { TicketStatePanel } from "./TicketStatePanel";

type TicketKanbanProps = {
  kanban?: TicketKanbanResponse;
  isFetching?: boolean;
};

type DragPayload = {
  ticketId: string;
  fromStatus: TicketStatus;
};

const encodeDragPayload = (payload: DragPayload) => JSON.stringify(payload);

const decodeDragPayload = (value: string): DragPayload | null => {
  try {
    const payload = JSON.parse(value) as Partial<DragPayload>;

    if (
      typeof payload.ticketId === "string" &&
      TICKET_STATUSES.includes(payload.fromStatus as TicketStatus)
    ) {
      return {
        ticketId: payload.ticketId,
        fromStatus: payload.fromStatus as TicketStatus,
      };
    }
  } catch {
    return null;
  }

  return null;
};

export function TicketKanban({ kanban, isFetching = false }: TicketKanbanProps) {
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const [updateTicketStatus] = useUpdateTicketStatusMutation();
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [activeDropStatus, setActiveDropStatus] = useState<TicketStatus | null>(null);
  const [movingTicketId, setMovingTicketId] = useState<string | null>(null);
  const totalTickets = TICKET_STATUSES.reduce(
    (total, status) => total + (kanban?.[status]?.length ?? 0),
    0,
  );

  const moveTicket = async (ticketId: string, status: TicketStatus) => {
    if (!isSuperAdmin) {
      notifyError(
        "Solo los superadministradores pueden actualizar tickets.",
        "Acción no permitida",
      );
      return;
    }

    setMovingTicketId(ticketId);

    try {
      await updateTicketStatus({
        id: ticketId,
        body: { status },
      }).unwrap();
      notifySuccess(
        `El ticket ahora está en ${TICKET_STATUS_LABELS[status]}.`,
        "Estado actualizado",
      );
    } catch (error) {
      notifyError(getApiErrorMessage(error), "No se pudo mover el ticket");
    } finally {
      setMovingTicketId(null);
    }
  };

  const handleDrop = async (
    event: DragEvent<HTMLDivElement>,
    status: TicketStatus,
  ) => {
    event.preventDefault();
    setActiveDropStatus(null);

    if (!isSuperAdmin) {
      return;
    }

    const payload = decodeDragPayload(event.dataTransfer.getData("application/json"));

    if (!payload || payload.fromStatus === status) {
      return;
    }

    await moveTicket(payload.ticketId, status);
  };

  if (!isFetching && totalTickets === 0) {
    return (
      <TicketStatePanel
        title="No hay tickets en el tablero"
        description="Crea un ticket o ajusta prioridad, categoría y búsqueda para ver tarjetas en Kanban."
      />
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {TICKET_STATUSES.map((status) => {
        const tickets = kanban?.[status] ?? [];
        const isActiveDrop = activeDropStatus === status;

        return (
          <div
            key={status}
            onDragOver={
              isSuperAdmin
                ? (event) => {
                    event.preventDefault();
                    setActiveDropStatus(status);
                  }
                : undefined
            }
            onDragLeave={
              isSuperAdmin ? () => setActiveDropStatus(null) : undefined
            }
            onDrop={
              isSuperAdmin
                ? (event) => {
                    void handleDrop(event, status);
                  }
                : undefined
            }
            className={`flex min-h-[28rem] flex-col rounded-lg border bg-white shadow-sm transition ${
              isActiveDrop
                ? "border-[#155dfc] ring-4 ring-blue-100"
                : "border-gray-200"
            }`}
          >
            <header className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-gray-950">
                    {TICKET_STATUS_LABELS[status]}
                  </h2>
                  <p className="mt-1 text-xs font-semibold leading-5 text-gray-500">
                    {TICKET_STATUS_HELP_TEXT[status]}
                  </p>
                </div>
                <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-gray-100 px-3 text-sm font-black text-gray-700">
                  {tickets.length}
                </span>
              </div>
            </header>

            <div className="flex flex-1 flex-col gap-3 p-3">
              {isFetching && totalTickets === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-44 animate-pulse rounded-lg bg-gray-100" />
                ))
              ) : tickets.length === 0 ? (
                <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm font-bold text-gray-400">
                  {isSuperAdmin
                    ? "Arrastra un ticket aquí o usa los botones de movimiento."
                    : "No hay tickets en esta columna."}
                </div>
              ) : (
                tickets.map((ticket) => (
                  <KanbanTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    movingTicketId={movingTicketId}
                    draggedTicketId={draggedTicketId}
                    onDragStart={(event) => {
                      if (!isSuperAdmin) {
                        event.preventDefault();
                        return;
                      }

                      setDraggedTicketId(ticket.id);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData(
                        "application/json",
                        encodeDragPayload({
                          ticketId: ticket.id,
                          fromStatus: ticket.status,
                        }),
                      );
                    }}
                    onDragEnd={() => {
                      setDraggedTicketId(null);
                      setActiveDropStatus(null);
                    }}
                    onMove={(nextStatus) => {
                      if (nextStatus !== ticket.status) {
                        void moveTicket(ticket.id, nextStatus);
                      }
                    }}
                    onView={() => router.push(`/tickets/${ticket.id}`)}
                    canMove={isSuperAdmin}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

type KanbanTicketCardProps = {
  ticket: Ticket;
  movingTicketId: string | null;
  draggedTicketId: string | null;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  onMove: (status: TicketStatus) => void;
  onView: () => void;
  canMove: boolean;
};

function KanbanTicketCard({
  ticket,
  movingTicketId,
  draggedTicketId,
  onDragStart,
  onDragEnd,
  onMove,
  onView,
  canMove,
}: KanbanTicketCardProps) {
  const isMoving = movingTicketId === ticket.id;
  const isDragging = draggedTicketId === ticket.id;

  return (
    <article
      draggable={canMove && !isMoving}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition ${
        isDragging ? "scale-[0.99] opacity-55" : "hover:border-blue-200 hover:shadow-md"
      } ${isMoving ? "pointer-events-none opacity-70" : ""}`}
    >
      <div className="flex flex-wrap gap-2">
        <TicketStatusBadge status={ticket.status} />
        <TicketPriorityBadge priority={ticket.priority} />
        <TicketCategoryBadge category={ticket.category} />
      </div>

      <h3 className="mt-3 line-clamp-2 text-base font-black text-gray-950">
        {ticket.subject}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-gray-500">
        {ticket.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <span className="text-xs font-bold text-gray-400">
          {formatTicketDate(ticket.createdAt)}
        </span>
        <ButtonBookmark
          type="button"
          text="Ver"
          icon={FiExternalLink}
          variant="secondary"
          width="w-[92px]"
          widthText="w-[42px]"
          widthHoverDinamic="group-hover:w-[84px]"
          onClick={onView}
        />
      </div>

      {canMove ? (
        <div className="mt-4">
          <p className="text-xs font-extrabold uppercase text-gray-400">
            Mover a
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            {TICKET_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                disabled={status === ticket.status || isMoving}
                onClick={() => onMove(status)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 text-xs font-extrabold text-gray-600 transition hover:border-[#155dfc] hover:text-[#155dfc] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                <FiArrowRight />
                {TICKET_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
