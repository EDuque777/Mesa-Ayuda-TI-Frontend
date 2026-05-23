"use client";

import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { IoClose, IoReload } from "react-icons/io5";
import { ImArrowUpRight2 } from "react-icons/im";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { InputText } from "@/shared/ui/inputs/InputText";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";
import { notifyAuthError, type AuthErrorContext } from "../lib/authNotifications";
import { isSixDigitCode } from "../lib/authValidation";

interface AuthCodeModalProps {
  open: boolean;
  email: string;
  title: string;
  description: string;
  submitLabel: string;
  isLoading: boolean;
  isResending?: boolean;
  resendLabel?: string;
  errorContext: AuthErrorContext;
  resendErrorContext?: AuthErrorContext;
  onClose: () => void;
  onSubmit: (code: string) => Promise<void>;
  onResend?: () => Promise<void>;
}

export function AuthCodeModal({
  open,
  email,
  title,
  description,
  submitLabel,
  isLoading,
  isResending = false,
  resendLabel = "Reenviar código",
  errorContext,
  resendErrorContext,
  onClose,
  onSubmit,
  onResend,
}: AuthCodeModalProps) {
  const titleId = useId();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isBusy = isLoading || isResending || isSubmitting;

  const resetState = () => {
    setCode("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isBusy) {
      return;
    }

    if (!isSixDigitCode(code)) {
      notifyAuthError(errorContext, "El código debe tener 6 dígitos.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(code);
      resetState();
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);
      notifyAuthError(errorContext, message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!onResend || isBusy) {
      return;
    }

    try {
      await onResend();
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);
      notifyAuthError(resendErrorContext ?? errorContext, message);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          role="presentation"
          onMouseMove={(event) => event.stopPropagation()}
        >
          <motion.section
            aria-labelledby={titleId}
            aria-modal="true"
            role="dialog"
            className="relative w-full max-w-md overflow-visible rounded-[18px] bg-white p-7 text-black shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={handleClose}
              disabled={isBusy}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IoClose className="text-2xl" />
            </button>

            <div className="flex flex-col gap-2 pr-8">
              <h2 id={titleId} className="text-2xl font-bold">
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-gray-500">
                {description}
              </p>
              {email && (
                <p className="text-sm font-semibold text-blue-600">{email}</p>
              )}
            </div>

            <form noValidate onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
              <InputText
                id="verification-code"
                name="code"
                label="Código de seguridad"
                containerStyle="w-full"
                value={code}
                onChange={handleCodeChange}
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                disabled={isBusy}
              />

              {onResend && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isBusy}
                  className="inline-flex w-fit items-center gap-2 self-center rounded-full px-3 py-1.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IoReload
                    className={`text-base ${isResending ? "animate-spin" : ""}`}
                  />
                  <span>{isResending ? "Reenviando código" : resendLabel}</span>
                </button>
              )}

              <ButtonBookmark
                type="submit"
                text={submitLabel}
                icon={ImArrowUpRight2}
                width="w-full"
                widthText="w-[95px]"
                widthHoverDinamic="group-hover:w-[97%]"
                disabled={isBusy}
                isLoading={isLoading || isSubmitting}
              />
            </form>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(modalContent, document.body);
}
