"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { notifyError, notifySuccessAndWait } from "@/shared/ui/toasts/notify";
import { useCreateTicketMutation } from "../api/ticketsApi";
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "../lib/ticketConstants";
import { validateTicketForm } from "../lib/ticketValidation";
import type { CreateTicketRequest } from "../types/ticket.types";
import { TicketForm } from "../components/TicketForm";
import { TicketPageShell } from "../components/TicketPageShell";

const INITIAL_FORM: CreateTicketRequest = {
  subject: "",
  description: "",
  category: TICKET_CATEGORIES[4],
  priority: TICKET_PRIORITIES[1],
};

export function CreateTicketPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateTicketRequest>(INITIAL_FORM);
  const [isWaitingForSuccessAlert, setIsWaitingForSuccessAlert] =
    useState(false);
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const isSubmitting = isLoading || isWaitingForSuccessAlert;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationMessage = validateTicketForm(form.subject, form.description);

    if (validationMessage) {
      notifyError(validationMessage, "Formulario incompleto");
      return;
    }

    try {
      const ticket = await createTicket({
        ...form,
        subject: form.subject.trim(),
        description: form.description.trim(),
      }).unwrap();

      setIsWaitingForSuccessAlert(true);
      await notifySuccessAndWait(
        "El ticket fue creado y quedó en estado Nuevo.",
        "Ticket creado",
      );
      setForm(INITIAL_FORM);
      router.push(ticket.id ? `/tickets/${ticket.id}` : "/tickets");
    } catch (error) {
      setIsWaitingForSuccessAlert(false);
      notifyError(getApiErrorMessage(error), "No se pudo crear el ticket");
    }
  };

  return (
    <TicketPageShell
      title="Crear ticket"
      description="Registra una solicitud de soporte con el contexto necesario para que el equipo técnico pueda priorizarla."
      actions={
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
      }
    >
      <TicketForm
        form={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel="Crear ticket"
      />
    </TicketPageShell>
  );
}
