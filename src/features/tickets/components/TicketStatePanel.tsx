import type { ReactNode } from "react";
import { FiAlertCircle } from "react-icons/fi";

type TicketStatePanelProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function TicketStatePanel({
  title,
  description,
  action,
}: TicketStatePanelProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
      <FiAlertCircle className="text-3xl text-gray-400" />
      <h2 className="mt-3 text-lg font-black text-gray-900">{title}</h2>
      <p className="mt-2 max-w-lg text-sm font-semibold leading-6 text-gray-500">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
