"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiDownload, FiGrid, FiList, FiPlusCircle, FiRefreshCcw } from "react-icons/fi";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";
import { useApiErrorToast } from "@/shared/lib/useApiErrorToast";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { notifyError, notifySuccess } from "@/shared/ui/toasts/notify";
import {
  useExportTicketsExcelMutation,
  useGetTicketsKanbanQuery,
  useListTicketsQuery,
} from "../api/ticketsApi";
import {
  TICKET_PAGE_LIMIT,
} from "../lib/ticketConstants";
import {
  normalizeSearch,
} from "../lib/ticketValidation";
import type {
  TicketFilters,
} from "../types/ticket.types";
import { TicketFilters as TicketFiltersPanel } from "../components/TicketFilters";
import { TicketKanban } from "../components/TicketKanban";
import { TicketList } from "../components/TicketList";
import { TicketPageShell } from "../components/TicketPageShell";
import { TicketStatePanel } from "../components/TicketStatePanel";

type ViewMode = "list" | "kanban";

const INITIAL_FILTERS: TicketFilters = {
  status: "",
  priority: "",
  category: "",
  search: "",
};

export function TicketsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TicketFilters>(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [exportTicketsExcel, { isLoading: isExporting, reset: resetExport }] =
    useExportTicketsExcelMutation();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(normalizeSearch(filters.search ?? ""));
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [filters.search]);

  const queryFilters = useMemo(
    () => ({
      status: filters.status,
      priority: filters.priority,
      category: filters.category,
      search: debouncedSearch,
    }),
    [debouncedSearch, filters.category, filters.priority, filters.status],
  );
  const kanbanFilters = useMemo(
    () => ({
      priority: queryFilters.priority,
      category: queryFilters.category,
      search: queryFilters.search,
    }),
    [queryFilters.category, queryFilters.priority, queryFilters.search],
  );
  const deferredPage = useDeferredValue(page);
  const deferredQueryFilters = useDeferredValue(queryFilters);
  const deferredKanbanFilters = useDeferredValue(kanbanFilters);

  const {
    data: listResponse,
    error: listError,
    isFetching: isFetchingList,
    refetch: refetchList,
  } = useListTicketsQuery(
    {
      ...deferredQueryFilters,
      page: deferredPage,
      limit: TICKET_PAGE_LIMIT,
    },
    {
      skip: viewMode !== "list",
    },
  );

  const {
    data: kanbanResponse,
    error: kanbanError,
    isFetching: isFetchingKanban,
    refetch: refetchKanban,
  } = useGetTicketsKanbanQuery(deferredKanbanFilters, {
    skip: viewMode !== "kanban",
  });

  const updateFilters = (nextFilters: TicketFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setDebouncedSearch("");
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const result = await exportTicketsExcel(queryFilters).unwrap();
      const link = document.createElement("a");

      link.href = result.downloadUrl;
      link.download = result.filename || "tickets.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(result.downloadUrl);
      resetExport();
      notifySuccess("El archivo Excel se generó con los filtros actuales.", "Excel descargado");
    } catch (error) {
      notifyError(getApiErrorMessage(error), "No se pudo exportar Excel");
    }
  };

  const currentError = viewMode === "list" ? listError : kanbanError;
  const currentErrorTitle =
    viewMode === "list"
      ? "No pudimos cargar los tickets"
      : "No pudimos cargar el tablero";
  const refetchCurrentView = viewMode === "list" ? refetchList : refetchKanban;
  const hasDisplayedCurrentView =
    viewMode === "list"
      ? Boolean(listResponse)
      : Boolean(kanbanResponse);
  const isUpdatingCurrentView =
    viewMode === "list" ? isFetchingList : isFetchingKanban;

  useApiErrorToast(currentError, currentErrorTitle);

  return (
    <TicketPageShell
      title="Tickets"
      description="Consulta, filtra y mueve solicitudes de soporte entre Nuevo, En proceso y Resuelto."
      actions={
        <>
          <ButtonBookmark
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            isLoading={isExporting}
            text={isExporting ? "Exportando" : "Exportar Excel"}
            icon={FiDownload}
            variant="secondary"
            width="w-52"
            widthText="w-[136px]"
            widthHoverDinamic="group-hover:w-[92%]"
          />
          <ButtonBookmark
            type="button"
            onClick={() => router.push("/create-ticket")}
            text="Crear ticket"
            icon={FiPlusCircle}
            width="w-46"
            widthText="w-[118px]"
            widthHoverDinamic="group-hover:w-[92%]"
          />
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-grid grid-cols-2 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-extrabold transition ${
                viewMode === "list"
                  ? "bg-white text-[#155dfc] shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <FiList />
              Lista
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-extrabold transition ${
                viewMode === "kanban"
                  ? "bg-white text-[#155dfc] shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <FiGrid />
              Kanban
            </button>
          </div>
          <p className="text-sm font-semibold text-gray-500">
            {viewMode === "kanban"
              ? "El filtro de estado no aplica al tablero porque ya está dividido por columnas."
              : "La lista respeta todos los filtros y paginación."}
          </p>
        </div>

        <TicketFiltersPanel
          filters={filters}
          showStatus={viewMode === "list"}
          onChange={updateFilters}
          onReset={resetFilters}
        />

        {currentError ? (
          <TicketStatePanel
            title={currentErrorTitle}
            description={getApiErrorMessage(currentError)}
            action={
              <ButtonBookmark
                type="button"
                onClick={() => refetchCurrentView()}
                text="Reintentar"
                icon={FiRefreshCcw}
                width="w-42"
                widthText="w-[98px]"
                widthHoverDinamic="group-hover:w-[90%]"
              />
            }
          />
        ) : viewMode === "list" ? (
          <div
            className={`min-h-[28rem] transition-opacity duration-300 ${
              isUpdatingCurrentView && hasDisplayedCurrentView
                ? "opacity-70"
                : "opacity-100"
            }`}
          >
            <TicketList
              tickets={listResponse?.data ?? []}
              meta={listResponse?.meta}
              isFetching={isFetchingList && !listResponse}
              onPageChange={setPage}
            />
          </div>
        ) : (
          <div
            className={`min-h-[28rem] transition-opacity duration-300 ${
              isUpdatingCurrentView && hasDisplayedCurrentView
                ? "opacity-70"
                : "opacity-100"
            }`}
          >
            <TicketKanban
              kanban={kanbanResponse}
              isFetching={isFetchingKanban && !kanbanResponse}
            />
          </div>
        )}
      </div>
    </TicketPageShell>
  );
}
