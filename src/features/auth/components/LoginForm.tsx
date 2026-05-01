"use client";

import React from "react";
import { InputEmail } from "@/shared/ui/inputs/InputEmail";
import { InputPassword } from "@/shared/ui/inputs/InputPassword";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { ImArrowUpRight2 } from "react-icons/im";

export function LoginForm() {
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Enviando login");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-7.5"
    >
      <InputEmail
        id="email"
        name="email"
        label="Correo electrónico"
        type="email"
        containerStyle="w-full"
        required={true}
      />
      <InputPassword
        id="password"
        name="password"
        label="Contraseña"
        containerStyle="w-full"
        required={true}
      />
      <ButtonBookmark
        type="submit"
        text="Ingresar"
        icon={ImArrowUpRight2}
        onClick={() => {}}
        width="w-full"
        widthText="w-[75px]"
        widthHoverDinamic="group-hover:w-[97%]"
      />
    </form>
  );
}
