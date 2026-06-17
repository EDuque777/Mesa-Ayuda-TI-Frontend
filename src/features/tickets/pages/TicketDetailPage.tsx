"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiEdit3,
  FiMessageSquare,
  FiRefreshCcw,
  FiSave,
  FiSend,
  FiX,
} from "react-icons/fi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";
import { useApiErrorToast } from "@/shared/lib/useApiErrorToast";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { InputSelect } from "@/shared/ui/inputs/InputSelect";
import { InputText } from "@/shared/ui/inputs/InputText";
import { InputTextarea } from "@/shared/ui/inputs/InputTextarea";
import { notifyError, notifyInfo, notifySuccess } from "@/shared/ui/toasts/notify";
import {
  useAddTicketCommentMutation,
  useGetTicketQuery,
  useListTicketCommentsQuery,
  useListTicketHistoryQuery,
  useUpdateTicketMutation,
  useUpdateTicketStatusMutation,
} from "../api/ticketsApi";
import {
  TICKET_CATEGORIES,
  TICKET_CATEGORY_LABELS,
  TICKET_COMMENT_MAX_LENGTH,
  TICKET_DESCRIPTION_MAX_LENGTH,
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUSES,
  TICKET_STATUS_LABELS,
  TICKET_SUBJECT_MAX_LENGTH,
} from "../lib/ticketConstants";
import {
  formatTicketDateTime,
  getHistoryDescription,
} from "../lib/ticketFormatters";
import {
  validateComment,
  validateTicketForm,
} from "../lib/ticketValidation";
import type {
  CreateTicketRequest,
  Ticket,
  TicketStatus,
  UpdateTicketRequest,
} from "../types/ticket.types";
import {
  TicketCategoryBadge,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "../components/TicketBadge";
import { TicketPageShell } from "../components/TicketPageShell";
import { TicketStatePanel } from "../components/TicketStatePanel";

type TicketDetailPageProps = {
  ticketId: string;
};

const emptyForm: CreateTicketRequest = {
  subject: "",
  description: "",
  category: "OTHER",
  priority: "MEDIUM",
};

export function TicketDetailPage({ ticketId }: TicketDetailPageProps) {
  const { isSuperAdmin } = useAuth();
  const {
    data: ticket,
    error: ticketError,
    isFetching: isFetchingTicket,
    refetch: refetchTicket,
  } = useGetTicketQuery(ticketId);
  const {
    data: comments,
    isFetching: isFetchingComments,
    error: commentsError,
  } = useListTicketCommentsQuery(ticketId);
  const {
    data: history,
    isFetching: isFetchingHistory,
    error: historyError,
  } = useListTicketHistoryQuery(ticketId);
  const [updateTicket, { isLoading: isUpdatingTicket }] =
    useUpdateTicketMutation();
  const [updateTicketStatus, { isLoading: isUpdatingStatus }] =
    useUpdateTicketStatusMutation();
  const [addTicketComment, { isLoading: isAddingComment }] =
    useAddTicketCommentMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CreateTicketRequest>(emptyForm);
  const [comment, setComment] = useState("");

  useApiErrorToast(ticketError, "No pudimos abrir el ticket");
  useApiErrorToast(commentsError, "No pudimos cargar los comentarios");
  useApiErrorToast(historyError, "No pudimos cargar el historial");

  const visibleComments = comments ?? ticket?.comments ?? [];
  const visibleHistory = history ?? ticket?.history ?? [];
  const isBusy = isUpdatingTicket || isUpdatingStatus || isAddingComment;
  const cannotUpdateTicketMessage =
    "Solo los superadministradores pueden actualizar tickets.";

  const changedFields = useMemo(() => {
    if (!ticket) {
      return {};
    }

    const nextBody: UpdateTicketRequest = {};
    const nextSubject = editForm.subject.trim();
    const nextDescription = editForm.description.trim();

    if (nextSubject !== ticket.subject) {
      nextBody.subject = nextSubject;
    }

    if (nextDescription !== ticket.description) {
      nextBody.description = nextDescription;
    }

    if (editForm.category !== ticket.category) {
      nextBody.category = editForm.category;
    }

    if (editForm.priority !== ticket.priority) {
      nextBody.priority = editForm.priority;
    }

    return nextBody;
  }, [editForm, ticket]);

  const handleSaveTicket = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSuperAdmin) {
      notifyError(cannotUpdateTicketMessage, "Acción no permitida");
      setIsEditing(false);
      return;
    }

    const validationMessage = validateTicketForm(
      editForm.subject,
      editForm.description,
    );

    if (validationMessage) {
      notifyError(validationMessage, "Formulario incompleto");
      return;
    }

    if (Object.keys(changedFields).length === 0) {
      notifyInfo("No hay cambios pendientes por guardar.", "Sin cambios");
      setIsEditing(false);
      return;
    }

    try {
      await updateTicket({
        id: ticketId,
        body: changedFields,
      }).unwrap();
      notifySuccess("Los datos del ticket fueron actualizados.", "Ticket actualizado");
      setIsEditing(false);
    } catch (error) {
      notifyError(getApiErrorMessage(error), "No se pudo actualizar");
    }
  };

  const openEditMode = (currentTicket: Ticket) => {
    if (!isSuperAdmin) {
      notifyError(cannotUpdateTicketMessage, "Acción no permitida");
      return;
    }

    setEditForm({
      subject: currentTicket.subject,
      description: currentTicket.description,
      category: currentTicket.category,
      priority: currentTicket.priority,
    });
    setIsEditing(true);
  };

  const closeEditMode = () => {
    setIsEditing(false);
    setEditForm(emptyForm);
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!isSuperAdmin) {
      notifyError(cannotUpdateTicketMessage, "Acción no permitida");
      return;
    }

    if (!ticket || status === ticket.status) {
      return;
    }

    try {
      await updateTicketStatus({
        id: ticket.id,
        body: { status },
      }).unwrap();
      notifySuccess(
        `El ticket ahora está en ${TICKET_STATUS_LABELS[status]}.`,
        "Estado actualizado",
      );
    } catch (error) {
      notifyError(getApiErrorMessage(error), "No se pudo cambiar el estado");
    }
  };

  const handleAddComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationMessage = validateComment(comment);

    if (validationMessage) {
      notifyError(validationMessage, "Comentario incompleto");
      return;
    }

    try {
      await addTicketComment({
        id: ticketId,
        body: {
          content: comment.trim(),
        },
      }).unwrap();
      notifySuccess("El comentario fue agregado al ticket.", "Comentario guardado");
      setComment("");
    } catch (error) {
      notifyError(getApiErrorMessage(error), "No se pudo comentar");
    }
  };

  if (ticketError) {
    return (
      <TicketPageShell
        title="Detalle de ticket"
        description="Consulta completa de una solicitud de soporte técnico."
        actions={<BackToTicketsLink />}
      >
        <TicketStatePanel
          title="No pudimos abrir el ticket"
          description={getApiErrorMessage(ticketError)}
          action={
            <ButtonBookmark
              type="button"
              onClick={() => refetchTicket()}
              text="Reintentar"
              icon={FiRefreshCcw}
              width="w-42"
              widthText="w-[98px]"
              widthHoverDinamic="group-hover:w-[90%]"
            />
          }
        />
      </TicketPageShell>
    );
  }

  if (!ticket && isFetchingTicket) {
    return (
      <TicketPageShell
        title="Detalle de ticket"
        description="Cargando información de la solicitud."
        actions={<BackToTicketsLink />}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
          <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </TicketPageShell>
    );
  }

  if (!ticket) {
    return (
      <TicketPageShell
        title="Detalle de ticket"
        description="Consulta completa de una solicitud de soporte técnico."
        actions={<BackToTicketsLink />}
      >
        <TicketStatePanel
          title="Ticket no disponible"
          description="No encontramos información para el ticket solicitado."
        />
      </TicketPageShell>
    );
  }

  return (
    <TicketPageShell
      title="Detalle de ticket"
      description={
        isSuperAdmin
          ? "Edita datos, cambia estado, agrega comentarios y revisa el historial operativo."
          : "Consulta datos, agrega comentarios y revisa el historial operativo."
      }
      actions={<BackToTicketsLink />}
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.42fr)_minmax(360px,0.58fr)]">
        <div className="flex flex-col gap-5">
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <TicketStatusBadge status={ticket.status} />
                  <TicketPriorityBadge priority={ticket.priority} />
                  <TicketCategoryBadge category={ticket.category} />
                </div>
                <h2 className="mt-4 text-2xl font-black text-gray-950">
                  {ticket.subject}
                </h2>
                <p className="mt-2 text-sm font-semibold text-gray-500">
                  Creado {formatTicketDateTime(ticket.createdAt)} - Actualizado{" "}
                  {formatTicketDateTime(ticket.updatedAt)}
                </p>
              </div>
              {isSuperAdmin ? (
                <ButtonBookmark
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      closeEditMode();
                      return;
                    }

                    openEditMode(ticket);
                  }}
                  disabled={isBusy}
                  text={isEditing ? "Cancelar" : "Editar datos"}
                  icon={isEditing ? FiX : FiEdit3}
                  variant="secondary"
                  width="w-full sm:w-46"
                  widthText="w-[120px]"
                  widthHoverDinamic="group-hover:w-[92%]"
                />
              ) : null}
            </div>

            {isSuperAdmin && isEditing ? (
              <form
                noValidate
                onSubmit={handleSaveTicket}
                className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2"
              >
                <InputText
                  id="edit-ticket-subject"
                  name="subject"
                  label="Asunto"
                  value={editForm.subject}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      subject: event.target.value,
                    }))
                  }
                  maxLength={TICKET_SUBJECT_MAX_LENGTH}
                  disabled={isUpdatingTicket}
                  containerStyle="lg:col-span-2"
                />
                <InputSelect
                  id="edit-ticket-category"
                  name="category"
                  label="Categoría"
                  value={editForm.category}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      category: event.target.value as Ticket["category"],
                    }))
                  }
                  disabled={isUpdatingTicket}
                >
                  {TICKET_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {TICKET_CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </InputSelect>
                <InputSelect
                  id="edit-ticket-priority"
                  name="priority"
                  label="Prioridad"
                  value={editForm.priority}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      priority: event.target.value as Ticket["priority"],
                    }))
                  }
                  disabled={isUpdatingTicket}
                >
                  {TICKET_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {TICKET_PRIORITY_LABELS[priority]}
                    </option>
                  ))}
                </InputSelect>
                <InputTextarea
                  id="edit-ticket-description"
                  name="description"
                  label="Descripcion"
                  value={editForm.description}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  maxLength={TICKET_DESCRIPTION_MAX_LENGTH}
                  disabled={isUpdatingTicket}
                  rows={7}
                  containerStyle="lg:col-span-2"
                />
                <div className="flex justify-end lg:col-span-2">
                  <ButtonBookmark
                    type="submit"
                    disabled={isUpdatingTicket}
                    isLoading={isUpdatingTicket}
                    text={isUpdatingTicket ? "Guardando" : "Guardar cambios"}
                    icon={FiSave}
                    width="w-full sm:w-56"
                    widthText="w-[150px]"
                    widthHoverDinamic="group-hover:w-[93%]"
                  />
                </div>
              </form>
            ) : (
              <p className="mt-6 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm font-semibold leading-7 text-gray-700">
                {ticket.description}
              </p>
            )}
          </section>

          {isSuperAdmin ? (
            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-gray-950">
                    Cambio de estado
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    Usa los botones como alternativa accesible al Kanban.
                  </p>
                </div>
                {isUpdatingStatus ? (
                  <span className="text-xs font-extrabold text-gray-400">
                    Actualizando
                  </span>
                ) : null}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {TICKET_STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    disabled={status === ticket.status || isUpdatingStatus}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-extrabold text-gray-700 transition hover:border-[#155dfc] hover:text-[#155dfc] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    {status === ticket.status ? <FiCheck /> : <FiRefreshCcw />}
                    {TICKET_STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-gray-950">
              Comentarios internos
            </h2>
            <form onSubmit={handleAddComment} className="mt-4">
              <InputTextarea
                id="ticket-comment"
                name="comment"
                label="Nuevo comentario"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={TICKET_COMMENT_MAX_LENGTH}
                disabled={isAddingComment}
                rows={4}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-gray-400">
                  {comment.length}/{TICKET_COMMENT_MAX_LENGTH}
                </span>
                <ButtonBookmark
                  type="submit"
                  disabled={isAddingComment}
                  isLoading={isAddingComment}
                  text={isAddingComment ? "Guardando" : "Agregar comentario"}
                  icon={FiSend}
                  width="w-58"
                  widthText="w-[162px]"
                  widthHoverDinamic="group-hover:w-[93%]"
                />
              </div>
            </form>

            <div className="mt-5 flex flex-col gap-3">
              {commentsError ? (
                <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">
                  {getApiErrorMessage(commentsError)}
                </p>
              ) : isFetchingComments && visibleComments.length === 0 ? (
                <div className="h-20 animate-pulse rounded-lg bg-gray-100" />
              ) : visibleComments.length === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm font-bold text-gray-400">
                  Este ticket aún no tiene comentarios.
                </p>
              ) : (
                visibleComments.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-black text-gray-800">
                      <FiMessageSquare className="text-[#155dfc]" />
                      {item.authorFullName ||
                        item.authorName ||
                        item.createdById ||
                        item.authorId ||
                        "Soporte"}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-gray-700">
                      {item.content}
                    </p>
                    <p className="mt-3 text-xs font-bold text-gray-400">
                      {formatTicketDateTime(item.createdAt)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-5">
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-gray-950">Resumen</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4">
              <SummaryItem label="ID" value={ticket.id} />
              <SummaryItem
                label="Creador"
                value={ticket.createdByFullName || ticket.createdById || "Usuario actual"}
              />
              <SummaryItem label="Creado" value={formatTicketDateTime(ticket.createdAt)} />
              <SummaryItem
                label="Actualizado"
                value={formatTicketDateTime(ticket.updatedAt)}
              />
            </dl>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-gray-950">Historial</h2>
              {isFetchingHistory ? (
                <span className="text-xs font-extrabold text-gray-400">
                  Actualizando
                </span>
              ) : null}
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {historyError ? (
                <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">
                  {getApiErrorMessage(historyError)}
                </p>
              ) : isFetchingHistory && visibleHistory.length === 0 ? (
                <div className="h-28 animate-pulse rounded-lg bg-gray-100" />
              ) : visibleHistory.length === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm font-bold text-gray-400">
                  Aun no hay historial de cambios.
                </p>
              ) : (
                visibleHistory.map((item) => (
                  <article
                    key={item.id}
                    className="border-l-4 border-[#155dfc] bg-gray-50 px-4 py-3"
                  >
                    <p className="text-sm font-extrabold text-gray-800">
                      {getHistoryDescription(item)}
                    </p>
                    <p className="mt-1 text-xs font-bold text-gray-400">
                      {formatTicketDateTime(item.createdAt)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </TicketPageShell>
  );
}

function BackToTicketsLink() {
  const router = useRouter();

  return (
    <ButtonBookmark
      type="button"
      onClick={() => router.push("/tickets")}
      text="Volver a tickets"
      icon={FiArrowLeft}
      variant="secondary"
      width="w-52"
      widthText="w-[138px]"
      widthHoverDinamic="group-hover:w-[92%]"
    />
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-extrabold uppercase text-gray-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-gray-800">{value}</dd>
    </div>
  );
}
