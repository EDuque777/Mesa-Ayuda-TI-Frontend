"use client";

import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { waitForSileoToClose } from "@/shared/ui/toasts/notify";
import { useAuth, useLogOut } from "@/features/auth";
import { notifyAuthError, notifyAuthSuccess } from "@/features/auth/lib/authNotifications";
import { getApiErrorMessage } from "@/shared/lib/apiErrors";

export function HomeContent() {
  const router = useRouter();
  const { clearAuthCredentials } = useAuth();
  const { logOut, isLoading } = useLogOut();

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
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-4 text-black">
      <h1 className="text-4xl font-bold">home</h1>
      <div className="w-full max-w-xs">
        <ButtonBookmark
          type="button"
          text={"Cerrar sesión"}
          icon={MdLogout}
          onClick={handleLogOut}
          width="w-full"
          widthText="w-[125px]"
          widthHoverDinamic="group-hover:w-[97%]"
          disabled={isLoading}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
