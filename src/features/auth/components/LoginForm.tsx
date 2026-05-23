"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImArrowUpRight2 } from "react-icons/im";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { InputEmail } from "@/shared/ui/inputs/InputEmail";
import { InputPassword } from "@/shared/ui/inputs/InputPassword";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";
import { waitForSileoToClose } from "@/shared/ui/toasts/notify";
import { useResendVerificationCode } from "../hooks/useResendVerificationCode";
import { useSignIn } from "../hooks/useSignIn";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useVerifySignInCode } from "../hooks/useVerifySignInCode";
import {
  isEmailVerificationPendingError,
  notifyAuthError,
  notifyAuthSuccess,
  notifyEmailVerificationPending,
} from "../lib/authNotifications";
import { EMAIL_MAX_LENGTH, isValidEmail } from "../lib/authValidation";
import { AuthCodeModal } from "./AuthCodeModal";

interface LoginFormState {
  email: string;
  password: string;
}

type VerificationMode = "signInCode" | "emailVerification";

const INITIAL_FORM_STATE: LoginFormState = {
  email: "",
  password: "",
};

export function LoginForm() {
  const router = useRouter();
  const { signIn, isLoading: isSigningIn } = useSignIn();
  const { verifySignInCode, isLoading: isVerifyingSignInCode } =
    useVerifySignInCode();
  const { verifyEmail, isLoading: isVerifyingEmail } = useVerifyEmail();
  const {
    resendVerificationCode,
    isLoading: isResendingVerificationCode,
  } = useResendVerificationCode();
  const [form, setForm] = useState<LoginFormState>(INITIAL_FORM_STATE);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationMode, setVerificationMode] =
    useState<VerificationMode>("signInCode");
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const isEmailVerificationMode = verificationMode === "emailVerification";
  const isVerifyingCode = isVerifyingSignInCode || isVerifyingEmail;

  const updateField =
    (field: keyof LoginFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const validateForm = () => {
    const email = form.email.trim();

    if (!email || !form.password) {
      return "Ingresa tu correo y contraseña.";
    }

    if (!isValidEmail(email)) {
      return `Ingresa un correo válido de máximo ${EMAIL_MAX_LENGTH} caracteres.`;
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
      setVerificationMode("emailVerification");
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
      notifyAuthError("signIn", validationMessage);
      return;
    }

    const nextEmail = form.email.trim();

    try {
      await signIn({
        email: nextEmail,
        password: form.password,
      });

      notifyAuthSuccess("signInCodeSent");
      setVerificationEmail(nextEmail);
      setVerificationMode("signInCode");
      setIsVerificationOpen(true);
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);

      if (isEmailVerificationPendingError(message)) {
        notifyEmailVerificationPending(() => {
          void handleFinishPendingVerification(nextEmail);
        });
        return;
      }

      notifyAuthError("signIn", message);
    }
  };

  const handleVerifyCode = async (code: string) => {
    if (isEmailVerificationMode) {
      await verifyEmail({
        email: verificationEmail,
        code,
      });

      notifyAuthSuccess("signUpVerified");
    } else {
      await verifySignInCode({
        email: verificationEmail,
        code,
      });

      notifyAuthSuccess("signInVerified");
    }

    await waitForSileoToClose();
    setIsVerificationOpen(false);
    setForm(INITIAL_FORM_STATE);
    router.replace("/home");
  };

  return (
    <>
      <form
        noValidate onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-7.5"
      >
        <InputEmail
          id="email"
          name="email"
          label="Correo electrónico"
          type="email"
          containerStyle="w-full"
          value={form.email}
          onChange={updateField("email")}
          maxLength={EMAIL_MAX_LENGTH}
          disabled={isSigningIn}
        />
        <InputPassword
          id="password"
          name="password"
          label="Contraseña"
          containerStyle="w-full"
          value={form.password}
          onChange={updateField("password")}
          disabled={isSigningIn}
        />
        <ButtonBookmark
          type="submit"
          text={"Ingresar"}
          icon={ImArrowUpRight2}
          width="w-full"
          widthText="w-[85px]"
          widthHoverDinamic="group-hover:w-[97%]"
          disabled={isSigningIn}
          isLoading={isSigningIn}
        />
      </form>

      <AuthCodeModal
        open={isVerificationOpen}
        email={verificationEmail}
        title={
          isEmailVerificationMode
            ? "Verificación de cuenta"
            : "Verificación de acceso"
        }
        description={
          isEmailVerificationMode
            ? "Ingresa el nuevo código que enviamos a tu correo para activar la cuenta."
            : "Ingresa el código que enviamos a tu correo para completar el inicio de sesión."
        }
        submitLabel={isEmailVerificationMode ? "Verificar" : "Entrar"}
        isLoading={isVerifyingCode}
        isResending={isResendingVerificationCode}
        errorContext={
          isEmailVerificationMode ? "verifySignUpCode" : "verifySignInCode"
        }
        resendErrorContext="resendVerificationCode"
        onClose={() => setIsVerificationOpen(false)}
        onSubmit={handleVerifyCode}
        onResend={
          isEmailVerificationMode ? handleResendVerificationCode : undefined
        }
      />
    </>
  );
}
