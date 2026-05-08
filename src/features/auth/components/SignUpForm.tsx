"use client";

import React from "react";
import { InputText } from "@/shared/ui/inputs/InputText";
import { InputEmail } from "@/shared/ui/inputs/InputEmail";
import { InputPassword } from "@/shared/ui/inputs/InputPassword";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { ImArrowUpRight2 } from "react-icons/im";

export function SignUpForm() {
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Enviando login");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-5"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <InputText
        id="name"
        name="name"
        label="Nombre"
        type="text"
        containerStyle="w-full"
        required={false}
      />
      <InputText
        id="lastName"
        name="lastName"
        label="Apellido"
        type="text"
        containerStyle="w-full"
        required={false}
      />
      </div>
      <InputEmail
        id="email"
        name="email"
        label="Correo electrónico"
        type="email"
        containerStyle="w-full"
        required={false}
      />
      <InputPassword
        id="password"
        name="password"
        label="Contraseña"
        containerStyle="w-full"
        required={false}
      />
      <InputPassword
        id="password"
        name="password"
        label="Confirmar Contraseña"
        containerStyle="w-full"
        required={false}
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
