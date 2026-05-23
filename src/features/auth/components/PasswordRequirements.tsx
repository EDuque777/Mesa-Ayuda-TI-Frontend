"use client";

import { FaCheck } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { getPasswordRequirements } from "../lib/authValidation";

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({
  password,
}: PasswordRequirementsProps) {
  const requirements = getPasswordRequirements(password);

  return (
    <ul className="grid w-full grid-cols-1 gap-2 rounded-[10px] border border-gray-200 bg-gray-50 p-3 text-sm md:grid-cols-2">
      {requirements.map((requirement) => (
        <li
          key={requirement.id}
          className={`flex items-center gap-2 transition-colors duration-200 ${
            requirement.isValid ? "text-emerald-600" : "text-gray-500"
          }`}
        >
          <span className="flex h-5 w-5 items-center justify-center">
            {requirement.isValid ? (
              <FaCheck className="text-[13px]" />
            ) : (
              <GoDotFill className="text-[16px]" />
            )}
          </span>
          <span>{requirement.label}</span>
        </li>
      ))}
    </ul>
  );
}
