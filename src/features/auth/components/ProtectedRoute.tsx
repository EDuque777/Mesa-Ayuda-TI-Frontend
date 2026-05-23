"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useRefreshToken } from "../hooks/useRefreshToken";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const hasStartedSessionCheck = useRef(false);
  const { isAuthenticated, clearAuthCredentials } = useAuth();
  const { refreshToken } = useRefreshToken();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const isCheckingSession = !isAuthenticated && !hasCheckedSession;

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    if (hasStartedSessionCheck.current) {
      return;
    }

    hasStartedSessionCheck.current = true;
    let isMounted = true;

    const hydrateSession = async () => {
      try {
        await refreshToken();
      } catch {
        clearAuthCredentials();

        if (isMounted) {
          router.replace("/");
        }
      } finally {
        if (isMounted) {
          setHasCheckedSession(true);
        }
      }
    };

    void hydrateSession();

    return () => {
      isMounted = false;
    };
  }, [
    clearAuthCredentials,
    isAuthenticated,
    refreshToken,
    router,
  ]);

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        <p className="text-sm font-semibold text-gray-500">Validando sesión...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
