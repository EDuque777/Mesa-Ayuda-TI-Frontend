"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiLogOut,
  FiPlusCircle,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import logoMesaAyuda from "../../../../public/img/logoMesaAyuda.png";
import { useAuth, useLogOut } from "@/features/auth";
import {
  notifyAuthError,
  notifyAuthSuccess,
} from "@/features/auth/lib/authNotifications";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";
import { waitForSileoToClose } from "@/shared/ui/toasts/notify";

type PrivateSidebarLayoutProps = {
  children: ReactNode;
};

type SidebarItem = {
  href: string;
  label: string;
  icon: IconType;
};

const sidebarItems: SidebarItem[] = [
  {
    href: "/home",
    label: "Dashboard",
    icon: FiGrid,
  },
  {
    href: "/tickets",
    label: "Tickets",
    icon: FiList,
  },
  {
    href: "/create-ticket",
    label: "Crear ticket",
    icon: FiPlusCircle,
  },
];

const getInitials = (fullName: string) => {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return "US";
  }

  return nameParts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export function PrivateSidebarLayout({ children }: PrivateSidebarLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, clearAuthCredentials } = useAuth();
  const { logOut, isLoading } = useLogOut();

  const fullName = useMemo(() => {
    return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  }, [user?.firstName, user?.lastName]);

  const displayName = fullName || "Usuario";
  const displayEmail = user?.email || "correo no disponible";
  const initials = getInitials(displayName);

  const handleToggleSidebar = () => {
    setIsCollapsed((currentValue) => !currentValue);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      notifyAuthSuccess("loggedOut");
    } catch (error) {
      clearAuthCredentials();
      notifyAuthError("logOut", getApiErrorMessage(error));
    }

    await waitForSileoToClose();
    router.replace("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      {!isCollapsed && (
        <button
          type="button"
          aria-label="Cerrar sidebar"
          onClick={handleToggleSidebar}
          className="fixed inset-0 z-30 cursor-default bg-black/35 backdrop-blur-[1px] transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen shrink-0 flex-col border-r-2 border-gray-300 bg-white shadow-2xl transition-[width] duration-300 ease-out ${
          isCollapsed ? "w-22" : "w-73"
        }`}
      >
        <div
          className={`relative flex justify-center items-center border-b-2 border-gray-300 px-5 ${isCollapsed ? "min-h-25" : "min-h-30"}`}
        >
          <Link
            href="/home"
            className={`flex min-w-0 items-center gap-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
            aria-label="Ir al dashboard"
          >
            <span
              className={`flex h-auto shrink-0 items-center justify-center overflow-hidden ${isCollapsed ? "w-15" : "w-32.5"}`}
            >
              <Image
                src={logoMesaAyuda}
                alt="Logo Mesa de Ayuda"
                width={500}
                height={380}
                priority
                className="h-auto w-full object-contain"
              />
            </span>
          </Link>

          <button
            type="button"
            onClick={handleToggleSidebar}
            aria-label={isCollapsed ? "Abrir sidebar" : "Cerrar sidebar"}
            aria-expanded={!isCollapsed}
            className="cursor-pointer absolute -right-4 top-8 flex h-8 w-8 items-center justify-center rounded-full border border-blue-100 bg-[#155dfc] text-white shadow-[0_10px_24px_rgba(21,93,252,0.28)] transition hover:scale-105 hover:bg-blue-700 active:scale-95"
          >
            {isCollapsed ? (
              <FiChevronRight className="text-lg" />
            ) : (
              <FiChevronLeft className="text-lg" />
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-4 py-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-12 items-center rounded-[14px] px-3 text-sm font-bold transition-all duration-300 ${
                  isCollapsed ? "justify-center gap-0" : "gap-3"
                } ${
                  isActive
                    ? "bg-[#155dfc] text-white shadow-[0_12px_28px_rgba(21,93,252,0.22)]"
                    : "text-gray-600 hover:bg-blue-50 hover:text-[#155dfc]"
                }`}
              >
                <Icon className="shrink-0 text-[21px]" />
                <span
                  className={`truncate transition-all duration-200 ${
                    isCollapsed
                      ? "w-0 translate-x-2 overflow-hidden opacity-0"
                      : "w-auto translate-x-0 opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t-2 border-gray-300 p-4">
          <div
            className={`flex items-center ${
              isCollapsed ? "flex-col justify-center gap-2" : "gap-3"
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#155dfc] text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(21,93,252,0.24)]">
              {initials}
            </span>

            <div
              className={`min-w-0 transition-all duration-200 ${
                isCollapsed
                  ? "h-0 w-0 flex-none overflow-hidden opacity-0"
                  : "h-auto w-auto flex-1 opacity-100"
              }`}
            >
              <p className="truncate text-sm font-extrabold text-black">
                {displayName}
              </p>
              <p className="truncate text-xs font-semibold text-gray-500">
                {displayEmail}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogOut}
              disabled={isLoading}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-blue-100 bg-white text-[#155dfc] transition duration-300 hover:bg-[#155dfc] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiLogOut className="text-[19px]" />
            </button>
          </div>
        </div>
      </aside>

      <div className="w-22 shrink-0" aria-hidden="true" />
      <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
