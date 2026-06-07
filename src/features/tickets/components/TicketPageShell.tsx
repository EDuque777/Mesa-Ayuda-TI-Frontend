import type { ReactNode } from "react";

type TicketPageShellProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function TicketPageShell({
  title,
  description,
  actions,
  children,
}: TicketPageShellProps) {
  return (
    <section className="mx-auto flex w-full max-w-[1540px] flex-col gap-6 px-4 py-6 text-black sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white/95 p-5 shadow-sm backdrop-blur lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#155dfc]">
            Mesa de ayuda TI
          </p>
          <h1 className="mt-2 text-3xl font-black text-gray-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-gray-500">
            {description}
          </p>
        </div>

        {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
      </header>

      {children}
    </section>
  );
}
