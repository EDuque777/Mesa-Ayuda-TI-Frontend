"use client";

import React from "react";
import { InputText } from "@/shared/ui/inputs/InputText";
import { InputPhone } from "@/shared/ui/inputs/InputPhone";
import { InputEmail } from "@/shared/ui/inputs/InputEmail";
import { InputPassword } from "@/shared/ui/inputs/InputPassword";
import { ButtonBookmark } from "@/shared/ui/buttons/ButtonBookmark";
import { FaSignInAlt } from "react-icons/fa";

export function RegistroForm () {
    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Enviando Registro");
    };

    return (
        <form
        onSubmit={handleSubmit}
        className="flex w-full grid grid-cols-2 items-center gap-7.5"
        >
        <InputText 
            id="nombre"
            name="nombre"
            label="Nombe"
            type="text"
            containerStyle="w-full"
            required={true}
        />
        <InputText 
            id="apellido"
            name="apellido"
            label="Apellido"
            type="text"
            containerStyle="w-full"
            required={true}
        />
        <InputPhone 
            id="telefono"
            name="telefono"
            label="Telefono"
            type="number"
            containerStyle="w-full"
            required={true}
        />
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
        <div className="col-span-2">
            <ButtonBookmark
                type="submit"
                text="Registrarme"
                icon={FaSignInAlt}
                onClick={() => {}}
                width="w-full"
                widthText="w-[75px]"
                widthHoverDinamic="group-hover:w-[97%]"
            />
        </div>
        </form>
    );
}