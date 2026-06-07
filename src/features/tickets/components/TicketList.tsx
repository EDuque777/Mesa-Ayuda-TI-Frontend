"use client";

import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";
import { formatTicketDate } from "../lib/ticketFormatters";
import type { Ticket, TicketListMeta } from "../types/ticket.types";
import {
  TicketCategoryBadge,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "./TicketBadge";
import { TicketStatePanel } from "./TicketStatePanel";

type TicketListProps = {
  tickets: Ticket[];
  meta?: TicketListMeta;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
};

export function TicketList({
  tickets,
  meta,
  isFetching = false,
  onPageChange,
}: TicketListProps) {
  if (!isFetching && tickets.length === 0) {
    return (
      <TicketStatePanel
        title="No hay tickets para mostrar"
        description="Ajusta los filtros o crea un nuevo ticket para comenzar el seguimiento."
      />
    );
  }

  const currentPage = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-black uppercase text-gray-500">
                Ticket
              </th>
              <th className="px-5 py-3 text-left text-xs font-black uppercase text-gray-500">
                Categoría
              </th>
              <th className="px-5 py-3 text-left text-xs font-black uppercase text-gray-500">
                Prioridad
              </th>
              <th className="px-5 py-3 text-left text-xs font-black uppercase text-gray-500">
                Estado
              </th>
              <th className="px-5 py-3 text-left text-xs font-black uppercase text-gray-500">
                Creado
              </th>
              <th className="px-5 py-3 text-right text-xs font-black uppercase text-gray-500">
                Accion
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isFetching && tickets.length === 0
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-5 py-4" colSpan={6}>
                      <div className="h-6 rounded bg-gray-100" />
                    </td>
                  </tr>
                ))
              : tickets.map((ticket) => (
                  <tr key={ticket.id} className="transition hover:bg-blue-50/45">
                    <td className="max-w-md px-5 py-4">
                      <p className="truncate text-sm font-black text-gray-950">
                        {ticket.subject}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-gray-500">
                        {ticket.description}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <TicketCategoryBadge category={ticket.category} />
                    </td>
                    <td className="px-5 py-4">
                      <TicketPriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-5 py-4">
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-600">
                      {formatTicketDate(ticket.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        prefetch={false}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-3 text-sm font-extrabold text-[#155dfc] transition hover:border-[#155dfc] hover:bg-blue-50"
                      >
                        Ver
                        <FiExternalLink />
                      </Link>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 lg:hidden">
        {isFetching && tickets.length === 0
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-lg bg-gray-100" />
            ))
          : tickets.map((ticket) => (
              <article
                key={ticket.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap gap-2">
                  <TicketStatusBadge status={ticket.status} />
                  <TicketPriorityBadge priority={ticket.priority} />
                  <TicketCategoryBadge category={ticket.category} />
                </div>
                <h2 className="mt-3 line-clamp-2 text-base font-black text-gray-950">
                  {ticket.subject}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-gray-500">
                  {ticket.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-gray-400">
                    {formatTicketDate(ticket.createdAt)}
                  </span>
                  <Link
                    href={`/tickets/${ticket.id}`}
                    prefetch={false}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#155dfc] px-3 text-sm font-extrabold text-white"
                  >
                    Ver
                    <FiExternalLink />
                  </Link>
                </div>
              </article>
            ))}
      </div>

      <footer className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-gray-500">
          {meta ? `${meta.total} tickets · pagina ${currentPage} de ${Math.max(totalPages, 1)}` : "Cargando tickets"}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!canGoBack || isFetching}
            onClick={() => onPageChange(currentPage - 1)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-extrabold text-gray-700 transition hover:border-[#155dfc] hover:text-[#155dfc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronLeft />
            Anterior
          </button>
          <button
            type="button"
            disabled={!canGoForward || isFetching}
            onClick={() => onPageChange(currentPage + 1)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-extrabold text-gray-700 transition hover:border-[#155dfc] hover:text-[#155dfc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
            <FiChevronRight />
          </button>
        </div>
      </footer>
    </section>
  );
}
