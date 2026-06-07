"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowUpRight2 } from "react-icons/im";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { InputEmail } from "@/shared/ui/inputs/InputEmail";
import { InputPassword } from "@/shared/ui/inputs/InputPassword";
import { InputText } from "@/shared/ui/inputs/InputText";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";
import { useResendVerificationCode } from "../hooks/useResendVerificationCode";
import { useSignUp } from "../hooks/useSignUp";
import { useVerifySignUpCode } from "../hooks/useVerifySignUpCode";
import {
  isEmailVerificationPendingError,
  notifyAuthError,
  notifyAuthSuccess,
  notifyAuthSuccessAndWait,
  notifyEmailVerificationPending,
} from "../lib/authNotifications";
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  isValidEmail,
  isValidPassword,
  passwordsMatch,
} from "../lib/authValidation";
import { AuthCodeModal } from "./AuthCodeModal";
import { PasswordMatchFeedback } from "./PasswordMatchFeedback";
import { PasswordRequirements } from "./PasswordRequirements";

interface SignUpFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM_STATE: SignUpFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoading: isSigningUp } = useSignUp();
  const { verifySignUpCode, isLoading: isVerifyingCode } =
    useVerifySignUpCode();
  const {
    resendVerificationCode,
    isLoading: isResendingVerificationCode,
  } = useResendVerificationCode();
  const [form, setForm] = useState<SignUpFormState>(INITIAL_FORM_STATE);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  const isPasswordReady = isValidPassword(form.password);
  const isConfirmPasswordReady = passwordsMatch(
    form.password,
    form.confirmPassword,
  );

  const updateField =
    (field: keyof SignUpFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const validateForm = () => {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();

    if (!firstName || !lastName || !email || !form.password) {
      return "Completa todos los campos para crear la cuenta.";
    }

    if (firstName.length > NAME_MAX_LENGTH || lastName.length > NAME_MAX_LENGTH) {
      return `Nombre y apellido deben tener máximo ${NAME_MAX_LENGTH} caracteres.`;
    }

    if (!isValidEmail(email)) {
      return `Ingresa un correo válido de máximo ${EMAIL_MAX_LENGTH} caracteres.`;
    }

    if (!isPasswordReady) {
      return "La contraseña todavía no cumple todos los requisitos.";
    }

    if (!isConfirmPasswordReady) {
      return "Las contraseñas no coinciden.";
    }

    return null;
  };

  const requestNewVerificationCode = async (email: string) => {
    await resendVerificationCode({ email });
    notifyAuthSuccess("verificationCodeResent");
  };

  const handleFinishPendingVerification = async (email: string) => {
    try {
      await requestNewVerificationCode(email);
      setVerificationEmail(email);
      setIsVerificationOpen(true);
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);
      notifyAuthError("resendVerificationCode", message);
    }
  };

  const handleResendVerificationCode = async () => {
    await requestNewVerificationCode(verificationEmail);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationMessage = validateForm();

    if (validationMessage) {
      notifyAuthError("signUp", validationMessage);
      return;
    }

    const nextEmail = form.email.trim();

    try {
      await signUp({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: nextEmail,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      notifyAuthSuccess("signUpCreated");
      setVerificationEmail(nextEmail);
      setIsVerificationOpen(true);
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);

      if (isEmailVerificationPendingError(message)) {
        notifyEmailVerificationPending(() => {
          void handleFinishPendingVerification(nextEmail);
        });
        return;
      }

      notifyAuthError("signUp", message);
    }
  };

  const handleVerifyCode = async (code: string) => {
    await verifySignUpCode({
      email: verificationEmail,
      code,
    });

    await notifyAuthSuccessAndWait("signUpVerified");
    setIsVerificationOpen(false);
    setForm(INITIAL_FORM_STATE);
    router.replace("/home");
  };

  return (
    <>
      <form
        noValidate onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-5"
      >
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <InputText
            id="firstName"
            name="firstName"
            label="Nombre"
            type="text"
            containerStyle="w-full"
            value={form.firstName}
            onChange={updateField("firstName")}
            maxLength={NAME_MAX_LENGTH}
            autoComplete="given-name"
            disabled={isSigningUp}
          />
          <InputText
            id="lastName"
            name="lastName"
            label="Apellido"
            type="text"
            containerStyle="w-full"
            value={form.lastName}
            onChange={updateField("lastName")}
            maxLength={NAME_MAX_LENGTH}
            autoComplete="family-name"
            disabled={isSigningUp}
          />
        </div>
        <InputEmail
          id="email"
          name="email"
          label="Correo electrónico"
          type="email"
          containerStyle="w-full"
          value={form.email}
          onChange={updateField("email")}
          maxLength={EMAIL_MAX_LENGTH}
          disabled={isSigningUp}
        />
        <InputPassword
          id="password"
          name="password"
          label="Contraseña"
          containerStyle="w-full"
          value={form.password}
          onChange={updateField("password")}
          autoComplete="new-password"
          disabled={isSigningUp}
        />
        <PasswordRequirements password={form.password} />
        <InputPassword
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar contraseña"
          containerStyle="w-full"
          value={form.confirmPassword}
          onChange={updateField("confirmPassword")}
          autoComplete="new-password"
          disabled={isSigningUp}
        />
        <PasswordMatchFeedback
          show={Boolean(form.confirmPassword)}
          isMatch={isConfirmPasswordReady}
        />
        <ButtonBookmark
          type="submit"
          text={"Registrarse"}
          icon={ImArrowUpRight2}
          width="w-full"
          widthText="w-[110px]"
          widthHoverDinamic="group-hover:w-[97%]"
          disabled={isSigningUp}
          isLoading={isSigningUp}
        />
      </form>

      <AuthCodeModal
        open={isVerificationOpen}
        email={verificationEmail}
        title="Verificación de registro"
        description="Ingresa el código que enviamos a tu correo para activar la cuenta."
        submitLabel="Verificar"
        isLoading={isVerifyingCode}
        isResending={isResendingVerificationCode}
        errorContext="verifySignUpCode"
        resendErrorContext="resendVerificationCode"
        onClose={() => setIsVerificationOpen(false)}
        onSubmit={handleVerifyCode}
        onResend={handleResendVerificationCode}
      />
    </>
  );
}
