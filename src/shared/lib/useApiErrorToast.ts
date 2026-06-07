"use client";

import { useEffect, useRef } from "react";
import { getApiErrorMessage } from "./apiErrors";
import { notifyError } from "@/shared/ui/toasts/notify";

export const useApiErrorToast = (
  error: unknown,
  title = "No se pudo completar",
) => {
  const lastToastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!error) {
      lastToastKey.current = null;
      return;
    }

    const message = getApiErrorMessage(error);
    const toastKey = `${title}:${message}`;

    if (lastToastKey.current === toastKey) {
      return;
    }

    lastToastKey.current = toastKey;
    notifyError(message, title);
  }, [error, title]);
};
