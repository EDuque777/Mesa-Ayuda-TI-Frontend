"use client";

import { useEffect, useRef } from "react";
import { useGetBackendHealthQuery } from "@/shared/api/healthApi";
import { notifyBackendUnavailable } from "../lib/authNotifications";

export function AuthBackendStatus() {
  const hasNotified = useRef(false);
  const { isError } = useGetBackendHealthQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError && !hasNotified.current) {
      hasNotified.current = true;
      notifyBackendUnavailable();
    }
  }, [isError]);

  return null;
}
