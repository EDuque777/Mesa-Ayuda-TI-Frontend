"use client";

import type { ChangeEvent, FormEvent } from "react";
import { FiSend } from "react-icons/fi";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { InputSelect } from "@/shared/ui/inputs/InputSelect";
import { InputText } from "@/shared/ui/inputs/InputText";
import { InputTextarea } from "@/shared/ui/inputs/InputTextarea";
import {
  TICKET_CATEGORIES,
  TICKET_CATEGORY_LABELS,
  TICKET_DESCRIPTION_MAX_LENGTH,
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LABELS,
  TICKET_SUBJECT_MAX_LENGTH,
} from "../lib/ticketConstants";
import type { CreateTicketRequest } from "../types/ticket.types";

type TicketFormProps = {
  form: CreateTicketRequest;
  submitLabel: string;
  isLoading?: boolean;
  onChange: (form: CreateTicketRequest) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TicketForm({
  form,
  submitLabel,
  isLoading = false,
  onChange,
  onSubmit,
}: TicketFormProps) {
  const updateField =
    (field: keyof CreateTicketRequest) =>
    (
      event:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLTextAreaElement>
        | ChangeEvent<HTMLSelectElement>,
    ) => {
      onChange({
        ...form,
        [field]: event.target.value,
      });
    };

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:grid-cols-2"
    >
      <div className="lg:col-span-2">
        <InputText
          id="ticket-subject"
          name="subject"
          label="Asunto"
          value={form.subject}
          onChange={updateField("subject")}
          maxLength={TICKET_SUBJECT_MAX_LENGTH}
          disabled={isLoading}
        />
        <span className="mt-1 block text-right text-xs font-bold text-gray-400">
          {form.subject.length}/{TICKET_SUBJECT_MAX_LENGTH}
        </span>
      </div>

      <InputSelect
        id="ticket-category"
        name="category"
        label="Categoría"
        value={form.category}
        onChange={updateField("category")}
        disabled={isLoading}
      >
        {TICKET_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {TICKET_CATEGORY_LABELS[category]}
          </option>
        ))}
      </InputSelect>

      <InputSelect
        id="ticket-priority"
        name="priority"
        label="Prioridad"
        value={form.priority}
        onChange={updateField("priority")}
        disabled={isLoading}
      >
        {TICKET_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {TICKET_PRIORITY_LABELS[priority]}
          </option>
        ))}
      </InputSelect>

      <div className="lg:col-span-2">
        <InputTextarea
          id="ticket-description"
          name="description"
          label="Descripcion"
          value={form.description}
          onChange={updateField("description")}
          maxLength={TICKET_DESCRIPTION_MAX_LENGTH}
          disabled={isLoading}
          rows={8}
        />
        <span className="mt-1 block text-right text-xs font-bold text-gray-400">
          {form.description.length}/{TICKET_DESCRIPTION_MAX_LENGTH}
        </span>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between lg:col-span-2">
        <p className="text-sm font-semibold text-gray-500">
          El estado inicial será Nuevo y podrás moverlo luego desde el Kanban.
        </p>
        <ButtonBookmark
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          text={isLoading ? "Guardando" : submitLabel}
          icon={FiSend}
          width="w-full sm:w-46"
          widthText="w-[124px]"
          widthHoverDinamic="group-hover:w-[92%]"
        />
      </div>
    </form>
  );
}
