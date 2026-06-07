"use client";

import { sileo, type SileoOptions } from "sileo";

export const SILEO_DEFAULT_DURATION_MS = 6000;
export const SILEO_EXIT_DURATION_MS = 600;
export const SILEO_DEFAULT_CLOSE_DELAY_MS =
  SILEO_DEFAULT_DURATION_MS + SILEO_EXIT_DURATION_MS;

interface ToastCopy {
  title: string;
  description?: string;
  waitClassName?: string;
}

interface ActionToastCopy extends ToastCopy {
  buttonTitle: string;
  onClick: () => void;
}

const buildOptions = ({
  title,
  description,
  waitClassName,
}: ToastCopy): SileoOptions => ({
  title,
  description,
  position: "top-center",
  styles: {
    title: ["!text-center !normal-case", waitClassName].filter(Boolean).join(" "),
    description: "!text-center !text-white",
  },
});

const waitForTimeout = (delayMs: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, delayMs);
  });

const createToastWaitClassName = () =>
  `sileo-toast-wait-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const waitForToastClassToClose = (className: string) =>
  new Promise<void>((resolve) => {
    if (typeof document === "undefined" || !document.body) {
      resolve();
      return;
    }

    let hasSeenToast = false;
    let hasResolved = false;
    let observer: MutationObserver | null = null;
    const selector = `.${className}`;

    const finish = () => {
      if (hasResolved) {
        return;
      }

      hasResolved = true;
      observer?.disconnect();
      window.clearTimeout(fallbackTimeout);

      resolve();
    };

    const checkToast = () => {
      const toastElement = document.querySelector(selector);

      if (toastElement) {
        hasSeenToast = true;
        return;
      }

      if (hasSeenToast) {
        finish();
      }
    };

    checkToast();

    observer = new MutationObserver(checkToast);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-exiting"],
      childList: true,
      subtree: true,
    });

    const fallbackTimeout = window.setTimeout(
      finish,
      SILEO_DEFAULT_CLOSE_DELAY_MS + SILEO_EXIT_DURATION_MS,
    );
  });

export const notifySuccess = (description: string, title = "Operación completada") =>
  sileo.success(buildOptions({ title, description }));

export const notifySuccessAndWait = async (
  description: string,
  title = "Operación completada",
) => {
  const waitClassName = createToastWaitClassName();

  sileo.success(buildOptions({ title, description, waitClassName }));
  await waitForToastClassToClose(waitClassName);
};

export const notifyError = (description: string, title = "No se pudo completar") =>
  sileo.error(buildOptions({ title, description }));

export const notifyInfo = (description: string, title = "Información") =>
  sileo.info(buildOptions({ title, description }));

export const notifyWarning = (description: string, title = "Atención") =>
  sileo.warning(buildOptions({ title, description }));

export const notifyAction = ({
  title,
  description,
  buttonTitle,
  onClick,
}: ActionToastCopy) => {
  let toastId = "";
  toastId = sileo.action({
    ...buildOptions({ title, description }),
    duration: null,
    button: {
      title: buttonTitle,
      onClick: () => {
        if (toastId) {
          sileo.dismiss(toastId);
        }

        onClick();
      },
    },
  });

  return toastId;
};

export const waitForSileoToClose = () =>
  waitForTimeout(SILEO_DEFAULT_CLOSE_DELAY_MS);
