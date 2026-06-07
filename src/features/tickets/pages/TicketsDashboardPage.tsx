"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  FiBarChart2,
  FiCheckCircle,
  FiInbox,
  FiPlusCircle,
  FiTool,
} from "react-icons/fi";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";
import { useApiErrorToast } from "@/shared/lib/useApiErrorToast";
import { useGetTicketMetricsQuery } from "../api/ticketsApi";
import {
  TICKET_CATEGORIES,
  TICKET_CATEGORY_LABELS,
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUSES,
  TICKET_STATUS_LABELS,
} from "../lib/ticketConstants";
import { TicketPageShell } from "../components/TicketPageShell";
import { TicketStatePanel } from "../components/TicketStatePanel";

export function TicketsDashboardPage() {
  const router = useRouter();
  const { data: metrics, error, isLoading, isFetching, refetch } =
    useGetTicketMetricsQuery({});

  useApiErrorToast(error, "No pudimos cargar las metricas");

  return (
    <TicketPageShell
      title="Dashboard"
      description="Vista ejecutiva de solicitudes de soporte técnico, carga por estado, categorías y prioridades."
      actions={
        <>
          <ButtonBookmark
            type="button"
            onClick={() => router.push("/tickets")}
            text="Ver tickets"
            icon={FiInbox}
            variant="secondary"
            width="w-42"
            widthText="w-[104px]"
            widthHoverDinamic="group-hover:w-[90%]"
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
      {error ? (
        <TicketStatePanel
          title="No pudimos cargar las metricas"
          description={getApiErrorMessage(error)}
          action={
            <ButtonBookmark
              type="button"
              onClick={() => refetch()}
              text="Reintentar"
              icon={FiTool}
              width="w-42"
              widthText="w-[98px]"
              widthHoverDinamic="group-hover:w-[90%]"
            />
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Tickets totales"
              value={metrics?.total ?? 0}
              isLoading={isLoading}
              icon={<FiBarChart2 />}
              tone="blue"
            />
            <MetricCard
              title="Nuevos"
              value={metrics?.byStatus.NEW ?? 0}
              isLoading={isLoading}
              icon={<FiInbox />}
              tone="sky"
            />
            <MetricCard
              title="En proceso"
              value={metrics?.byStatus.IN_PROGRESS ?? 0}
              isLoading={isLoading}
              icon={<FiTool />}
              tone="amber"
            />
            <MetricCard
              title="Resueltos"
              value={metrics?.byStatus.RESOLVED ?? 0}
              isLoading={isLoading}
              icon={<FiCheckCircle />}
              tone="green"
            />
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <DistributionPanel
              title="Por estado"
              isFetching={isFetching}
              items={TICKET_STATUSES.map((status) => ({
                label: TICKET_STATUS_LABELS[status],
                value: metrics?.byStatus[status] ?? 0,
                total: metrics?.total ?? 0,
              }))}
            />
            <DistributionPanel
              title="Por prioridad"
              isFetching={isFetching}
              items={TICKET_PRIORITIES.map((priority) => ({
                label: TICKET_PRIORITY_LABELS[priority],
                value: metrics?.byPriority[priority] ?? 0,
                total: metrics?.total ?? 0,
              }))}
            />
            <DistributionPanel
              title="Por categoria"
              isFetching={isFetching}
              items={TICKET_CATEGORIES.map((category) => ({
                label: TICKET_CATEGORY_LABELS[category],
                value: metrics?.byCategory[category] ?? 0,
                total: metrics?.total ?? 0,
              }))}
            />
          </section>
        </div>
      )}
    </TicketPageShell>
  );
}

type MetricCardProps = {
  title: string;
  value: number;
  isLoading: boolean;
  icon: ReactNode;
  tone: "blue" | "sky" | "amber" | "green";
};

const metricToneClasses: Record<MetricCardProps["tone"], string> = {
  blue: "bg-blue-50 text-[#155dfc]",
  sky: "bg-sky-50 text-sky-700",
  amber: "bg-amber-50 text-amber-700",
  green: "bg-emerald-50 text-emerald-700",
};

function MetricCard({ title, value, isLoading, icon, tone }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-gray-500">{title}</p>
          {isLoading ? (
            <div className="mt-4 h-10 w-24 animate-pulse rounded bg-gray-100" />
          ) : (
            <p className="mt-2 text-4xl font-black text-gray-950">{value}</p>
          )}
        </div>
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${metricToneClasses[tone]}`}
        >
          {icon}
        </span>
      </div>
    </article>
  );
}

type DistributionPanelProps = {
  title: string;
  isFetching: boolean;
  items: Array<{
    label: string;
    value: number;
    total: number;
  }>;
};

function DistributionPanel({ title, isFetching, items }: DistributionPanelProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-gray-950">{title}</h2>
        {isFetching ? (
          <span className="text-xs font-extrabold text-gray-400">Actualizando</span>
        ) : null}
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {items.map((item) => {
          const percent = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-extrabold text-gray-700">{item.label}</span>
                <span className="font-black text-gray-950">{item.value}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#155dfc]"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
