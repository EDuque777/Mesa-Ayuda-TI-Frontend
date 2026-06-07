"use client";

import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ImArrowUpRight2 } from "react-icons/im";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { InputEmail } from "@/shared/ui/inputs/InputEmail";
import { InputPassword } from "@/shared/ui/inputs/InputPassword";
import { InputText } from "@/shared/ui/inputs/InputText";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { useResetPassword } from "../hooks/useResetPassword";
import {
  notifyAuthError,
  notifyAuthSuccess,
  notifyAuthSuccessAndWait,
} from "../lib/authNotifications";
import {
  EMAIL_MAX_LENGTH,
  isSixDigitCode,
  isValidEmail,
  isValidPassword,
  passwordsMatch,
} from "../lib/authValidation";
import { PasswordMatchFeedback } from "./PasswordMatchFeedback";
import { PasswordRequirements } from "./PasswordRequirements";

type ResetStep = 1 | 2 | 3;
type StepDirection = 1 | -1;

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface ResetPasswordFormState {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

const INITIAL_FORM_STATE: ResetPasswordFormState = {
  email: "",
  code: "",
  newPassword: "",
  confirmPassword: "",
};

const STEP_TITLES: Record<ResetStep, string> = {
  1: "Restablecer contraseña",
  2: "Código de seguridad",
  3: "Nueva contraseña",
};

export function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const titleId = useId();
  const { forgotPassword, isLoading: isSendingCode } = useForgotPassword();
  const { resetPassword, isLoading: isResettingPassword } = useResetPassword();
  const [step, setStep] = useState<ResetStep>(1);
  const [direction, setDirection] = useState<StepDirection>(1);
  const [isWaitingForSuccessAlert, setIsWaitingForSuccessAlert] =
    useState(false);
  const [form, setForm] =
    useState<ResetPasswordFormState>(INITIAL_FORM_STATE);

  const isLoading =
    isSendingCode || isResettingPassword || isWaitingForSuccessAlert;
  const isPasswordReady = isValidPassword(form.newPassword);
  const isConfirmPasswordReady = passwordsMatch(
    form.newPassword,
    form.confirmPassword,
  );

  const resetModalState = () => {
    setStep(1);
    setDirection(1);
    setForm(INITIAL_FORM_STATE);
  };

  const updateField =
    (field: keyof ResetPasswordFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue =
        field === "code"
          ? event.target.value.replace(/\D/g, "").slice(0, 6)
          : event.target.value;

      setForm((currentForm) => ({
        ...currentForm,
        [field]: nextValue,
      }));
    };

  const moveToStep = (nextStep: ResetStep) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetModalState();
      onClose();
    }
  };

  const handleRequestCode = async () => {
    const email = form.email.trim();

    if (!isValidEmail(email)) {
      const message = `Ingresa un correo válido de máximo ${EMAIL_MAX_LENGTH} caracteres.`;
      notifyAuthError("forgotPassword", message);
      return;
    }

    try {
      await forgotPassword({ email });
      notifyAuthSuccess("forgotPasswordCodeSent");
      setForm((currentForm) => ({ ...currentForm, email }));
      moveToStep(2);
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);
      notifyAuthError("forgotPassword", message);
    }
  };

  const handleConfirmCode = () => {
    if (!isSixDigitCode(form.code)) {
      const message = "El código debe tener 6 dígitos.";
      notifyAuthError("resetPassword", message);
      return;
    }

    moveToStep(3);
  };

  const handleResetPassword = async () => {
    if (!isPasswordReady) {
      const message = "La nueva contraseña todavía no cumple todos los requisitos.";
      notifyAuthError("resetPassword", message);
      return;
    }

    if (!isConfirmPasswordReady) {
      const message = "Las contraseñas no coinciden.";
      notifyAuthError("resetPassword", message);
      return;
    }

    try {
      await resetPassword({
        email: form.email,
        code: form.code,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setIsWaitingForSuccessAlert(true);
      await notifyAuthSuccessAndWait("passwordReset");
      resetModalState();
      setIsWaitingForSuccessAlert(false);
      onClose();
    } catch (requestError) {
      setIsWaitingForSuccessAlert(false);
      const message = getApiErrorMessage(requestError);
      notifyAuthError("resetPassword", message);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === 1) {
      await handleRequestCode();
      return;
    }

    if (step === 2) {
      handleConfirmCode();
      return;
    }

    await handleResetPassword();
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <InputEmail
          id="reset-email"
          name="email"
          label="Correo electrónico"
          type="email"
          containerStyle="w-full"
          value={form.email}
          onChange={updateField("email")}
          maxLength={EMAIL_MAX_LENGTH}
          disabled={isLoading}
        />
      );
    }

    if (step === 2) {
      return (
        <InputText
          id="reset-code"
          name="code"
          label="Código de seguridad"
          type="text"
          containerStyle="w-full"
          value={form.code}
          onChange={updateField("code")}
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
          disabled={isLoading}
        />
      );
    }

    return (
      <div className="flex w-full flex-col gap-5">
        <InputPassword
          id="newPassword"
          name="newPassword"
          label="Nueva contraseña"
          containerStyle="w-full"
          value={form.newPassword}
          onChange={updateField("newPassword")}
          autoComplete="new-password"
          disabled={isLoading}
        />
        <PasswordRequirements password={form.newPassword} />
        <InputPassword
          id="confirmNewPassword"
          name="confirmNewPassword"
          label="Confirmar contraseña"
          containerStyle="w-full"
          value={form.confirmPassword}
          onChange={updateField("confirmPassword")}
          autoComplete="new-password"
          disabled={isLoading}
        />
        <PasswordMatchFeedback
          show={Boolean(form.confirmPassword)}
          isMatch={isConfirmPasswordReady}
        />
      </div>
    );
  };

  const actionText =
    step === 1 ? "Enviar código" : step === 2 ? "Continuar" : "Cambiar";

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
            className="relative w-full max-w-lg overflow-visible rounded-[18px] bg-white p-7 text-black shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-7 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    aria-label="Volver"
                    onClick={() => moveToStep((step - 1) as ResetStep)}
                    disabled={isLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <IoArrowBack className="text-xl" />
                  </button>
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                    Paso {step} de 3
                  </p>
                  <h2 id={titleId} className="text-2xl font-bold">
                    {STEP_TITLES[step]}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                aria-label="Cerrar"
                onClick={handleClose}
                disabled={isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative py-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: direction * 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex flex-col gap-5"
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
                  <motion.div
                    key={`curtain-${step}-${direction}`}
                    aria-hidden
                    className="h-full w-full bg-white"
                    initial={{ x: direction === 1 ? "-105%" : "105%" }}
                    animate={{ x: direction === 1 ? "105%" : "-105%" }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <ButtonBookmark
                type="submit"
                text={actionText}
                icon={ImArrowUpRight2}
                width="w-full"
                widthText="w-[120px]"
                widthHoverDinamic="group-hover:w-[97%]"
                disabled={isLoading}
                isLoading={isLoading}
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
