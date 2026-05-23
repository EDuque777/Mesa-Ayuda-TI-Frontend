"use client";

import { sileo, type SileoOptions } from "sileo";

export const SILEO_DEFAULT_CLOSE_DELAY_MS = 6600;

interface ToastCopy {
  title: string;
  description?: string;
}

interface ActionToastCopy extends ToastCopy {
  buttonTitle: string;
  onClick: () => void;
}

const buildOptions = ({ title, description }: ToastCopy): SileoOptions => ({
  title,
  description,
  position: "top-center",
  styles: {
    title: "!text-center",
    description: "!text-center !text-white",
  },
});

export const notifySuccess = (description: string, title = "Operación completada") =>
  sileo.success(buildOptions({ title, description }));

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
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, SILEO_DEFAULT_CLOSE_DELAY_MS);
  });
