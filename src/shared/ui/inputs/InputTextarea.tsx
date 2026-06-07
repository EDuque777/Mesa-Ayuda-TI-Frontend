import React from "react";
import { FiFileText } from "react-icons/fi";
import "./inputs.css";

type InputTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className" | "id" | "name" | "required"
> & {
  id: string;
  name: string;
  label: string;
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

export function InputTextarea({
  id,
  name,
  label,
  required = false,
  containerStyle = "",
  rows = 5,
  ...textareaProps
}: InputTextareaProps) {
  return (
    <div className={`relative ${containerStyle}`}>
      <textarea
        id={id}
        required={required}
        name={name}
        rows={rows}
        placeholder=" "
        className="peer min-h-32 w-full resize-y rounded-[10px] border-2 border-black bg-white pb-3.75 pl-10 pr-3.75 pt-5 text-base font-normal leading-6 text-black outline-none transition-all duration-400 ease-out focus:border-blue-600 focus:shadow-[0_5px_8px_rgba(21,93,252,0.3),0_10px_20px_rgba(21,93,252,0.2),0_15px_40px_rgba(21,93,252,0.15),0_20px_60px_rgba(21,93,252,0.1)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        {...textareaProps}
      />

      <FiFileText className="pointer-events-none absolute left-4 top-8 z-10 -translate-y-1/2 text-[20px] text-gray-500 transition-colors duration-300 peer-focus:text-blue-600" />

      <label
        htmlFor={id}
        className="pointer-events-none absolute left-2.5 top-0 -translate-y-1/2 bg-white px-1.25 text-xs text-black transition-all duration-400 ease-out peer-focus:text-blue-600"
      >
        {label}
      </label>

      {particles.map((particle, index) => (
        <div
          key={index}
          className="pointer-events-none absolute left-2.5 top-8 h-1.5 w-1.5 rounded-full opacity-0 blur-[0.8px] transition-opacity duration-300 peer-focus:animate-[nebula-float_2s_forwards_ease-out]"
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
