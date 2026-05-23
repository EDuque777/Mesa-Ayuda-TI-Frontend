import React from "react";
import "./inputs.css";
import { MdAlternateEmail } from "react-icons/md";

type InputEmailProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className" | "id" | "name" | "required" | "type"
> & {
  id: string;
  name: string;
  label: string;
  type?: "email";
  required?: boolean;
  containerStyle?: string;
};

const particles = [
  { x: 0.2, y: -0.4, delay: "0.1s" },
  { x: 0.5, y: -0.2, delay: "0.3s" },
  { x: 0.3, y: 0.3, delay: "0.5s" },
  { x: 0.7, y: 0.1, delay: "0.2s" },
  { x: 0.1, y: -0.7, delay: "0.4s" },
  { x: 0.6, y: 0.4, delay: "0.6s" },
];

export function InputEmail({
  id,
  name,
  label,
  type = "email",
  autoComplete = "email",
  required = false,
  containerStyle = "",
  ...inputProps
}: InputEmailProps) {
  return (
    <div className={`relative ${containerStyle}`}>
      <input
        id={id}
        required={required}
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer w-full rounded-[10px] border-2 border-black bg-white pl-10 pr-3.75 pt-3.75 pb-3.75 text-base text-black outline-none transition-all duration-400 ease-out focus:border-blue-600 focus:shadow-[0_5px_8px_rgba(21,93,252,0.3),0_10px_20px_rgba(21,93,252,0.2),0_15px_40px_rgba(21,93,252,0.15),0_20px_60px_rgba(21,93,252,0.1)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        {...inputProps}
      />

      <MdAlternateEmail className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[20px] text-gray-500 transition-colors duration-300 peer-focus:text-blue-600" />

      <label
        htmlFor={id}
        className="pointer-events-none absolute left-9 top-4 bg-white px-1.25 text-gray-500 transition-all duration-400 ease-out
  peer-focus:left-2.5 peer-focus:-translate-y-6.25 peer-focus:text-xs peer-focus:text-blue-600
  peer-[:not(:placeholder-shown)]:left-2.5 peer-[:not(:placeholder-shown)]:-translate-y-6.25 peer-[:not(:placeholder-shown)]:text-xs
  peer-[:not(:focus):not(:placeholder-shown)]:text-black"
      >
        {label}
      </label>
      
      {particles.map((particle, index) => (
        <div
          key={index}
          className="pointer-events-none absolute left-2.5 top-1/2 h-1.5 w-1.5 rounded-full opacity-0 blur-[0.8px] transition-opacity duration-300 peer-focus:animate-[nebula-float_2s_forwards_ease-out]"
          style={
            {
              "--x": particle.x,
              "--y": particle.y,
              "--delay": particle.delay,
              animationDelay: particle.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
