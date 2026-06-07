"use client";

import { FiRotateCcw } from "react-icons/fi";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { InputSelect } from "@/shared/ui/inputs/InputSelect";
import { InputText } from "@/shared/ui/inputs/InputText";
import {
  TICKET_CATEGORIES,
  TICKET_CATEGORY_LABELS,
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LABELS,
  TICKET_SEARCH_MAX_LENGTH,
  TICKET_STATUSES,
  TICKET_STATUS_LABELS,
} from "../lib/ticketConstants";
import type { TicketFilters } from "../types/ticket.types";

type TicketFiltersProps = {
  filters: TicketFilters;
  showStatus?: boolean;
  onChange: (filters: TicketFilters) => void;
  onReset: () => void;
};

export function TicketFilters({
  filters,
  showStatus = true,
  onChange,
  onReset,
}: TicketFiltersProps) {
  const updateFilter = (field: keyof TicketFilters, value: string) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(280px,1.3fr)_repeat(3,minmax(150px,0.7fr))_auto]">
        <InputText
          id="ticket-search"
          name="search"
          label="Busqueda"
          value={filters.search ?? ""}
          onChange={(event) => updateFilter("search", event.target.value)}
          maxLength={TICKET_SEARCH_MAX_LENGTH}
          containerStyle="min-w-0"
        />

        {showStatus ? (
          <InputSelect
            id="ticket-status-filter"
            name="status"
            label="Estado"
            value={filters.status ?? ""}
            onChange={(event) => updateFilter("status", event.target.value)}
            containerStyle="min-w-0"
          >
            <option value="">Todos</option>
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {TICKET_STATUS_LABELS[status]}
              </option>
            ))}
          </InputSelect>
        ) : null}

        <InputSelect
          id="ticket-priority-filter"
          name="priority"
          label="Prioridad"
          value={filters.priority ?? ""}
          onChange={(event) => updateFilter("priority", event.target.value)}
          containerStyle="min-w-0"
        >
          <option value="">Todas</option>
          {TICKET_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {TICKET_PRIORITY_LABELS[priority]}
            </option>
          ))}
        </InputSelect>

        <InputSelect
          id="ticket-category-filter"
          name="category"
          label="Categoría"
          value={filters.category ?? ""}
          onChange={(event) => updateFilter("category", event.target.value)}
          containerStyle="min-w-0"
        >
          <option value="">Todas</option>
          {TICKET_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {TICKET_CATEGORY_LABELS[category]}
            </option>
          ))}
        </InputSelect>

        <div className="flex items-end">
          <ButtonBookmark
            type="button"
            onClick={onReset}
            text="Limpiar"
            icon={FiRotateCcw}
            variant="secondary"
            width="w-full xl:w-38"
            widthText="w-[82px]"
            widthHoverDinamic="group-hover:w-[88%]"
          />
        </div>
      </div>
    </section>
  );
}
