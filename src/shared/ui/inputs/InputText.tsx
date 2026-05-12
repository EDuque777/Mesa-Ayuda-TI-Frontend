import React from "react";
import "./inputs.css";

type InputTextProps = {
  id: string;
  name: string;
  label: string;
  type: "text"
  autoComplete?: string;
  required: boolean;
  containerStyle: string;
};

const particles = [
  { x: 0.2, y: -0.4, delay: "0.1s" },
  { x: 0.5, y: -0.2, delay: "0.3s" },
  { x: 0.3, y: 0.3, delay: "0.5s" },
  { x: 0.7, y: 0.1, delay: "0.2s" },
  { x: 0.1, y: -0.7, delay: "0.4s" },
  { x: 0.6, y: 0.4, delay: "0.6s" },
];

export function InputText({
  id,
  name,
  label,
  type,
  autoComplete = "text",
  required,
  containerStyle,
}: InputTextProps) {
  return (
    <div className={`relative ${containerStyle}`}>
      
      <input
        id={id}
        required={required}
        type={type}
        name={name}
        autoComplete={autoComplete}
        className="peer w-full rounded-[10px] border-2 border-black bg-white pl-2 pr-3.75 pt-3.75 pb-3.75 text-base text-black outline-none transition-all duration-400 ease-out focus:border-blue-600 focus:shadow-[0_5px_8px_rgba(21,93,252,0.3),0_10px_20px_rgba(21,93,252,0.2),0_15px_40px_rgba(21,93,252,0.15),0_20px_60px_rgba(21,93,252,0.1)]"
      />

      <label
        htmlFor={id}
        className="pointer-events-none absolute left-2 top-4 bg-white px-1.25 text-gray-500 transition-all duration-400 ease-out peer-focus:left-2.5 peer-focus:-translate-y-6.25 peer-focus:text-xs peer-focus:text-blue-600 peer-valid:left-2.5 peer-valid:-translate-y-6.25 peer-valid:text-xs peer-valid:text-blue-600"
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
