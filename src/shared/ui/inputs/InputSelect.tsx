"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiList } from "react-icons/fi";
import "./inputs.css";

type InputSelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
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

type OptionElementProps = {
  disabled?: boolean;
  value?: string | number;
  children?: React.ReactNode;
};

const getOptionText = (option: React.ReactNode) => {
  if (!React.isValidElement<OptionElementProps>(option)) {
    return "";
  }

  return React.Children.toArray(option.props.children).join("");
};

export function InputSelect({
  id,
  name,
  label,
  required = false,
  containerStyle = "",
  children,
  ...selectProps
}: InputSelectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number | readonly string[] | undefined>(
    selectProps.defaultValue,
  );
  const options = useMemo(
    () =>
      React.Children.toArray(children)
        .filter(React.isValidElement<OptionElementProps>)
        .map((option) => {
          const labelText = getOptionText(option);

          return {
            disabled: Boolean(option.props.disabled),
            label: labelText,
            value: String(option.props.value ?? labelText),
          };
        }),
    [children],
  );
  const currentValue = selectProps.value ?? internalValue ?? options[0]?.value ?? "";
  const selectedOption =
    options.find((option) => option.value === String(currentValue)) ?? options[0];
  const selectedText = selectedOption?.label ?? "";
  const isDisabled = Boolean(selectProps.disabled);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const selectOption = (nextValue: string) => {
    setInternalValue(nextValue);
    setIsOpen(false);

    selectProps.onChange?.({
      currentTarget: { id, name, value: nextValue },
      target: { id, name, value: nextValue },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div ref={containerRef} className={`relative ${containerStyle}`}>
      <input
        id={id}
        type="hidden"
        name={name}
        required={required}
        value={String(currentValue)}
        disabled={isDisabled}
        readOnly
      />

      <button
        type="button"
        disabled={isDisabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label`}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-13 w-full cursor-pointer items-center rounded-[10px] border-2 bg-white pl-4 pr-4 text-black outline-none transition-all duration-400 ease-out disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${
          isOpen
            ? "border-blue-600 shadow-[0_5px_8px_rgba(21,93,252,0.3),0_10px_20px_rgba(21,93,252,0.2),0_15px_40px_rgba(21,93,252,0.15),0_20px_60px_rgba(21,93,252,0.1)]"
            : "border-black focus:border-blue-600 focus:shadow-[0_5px_8px_rgba(21,93,252,0.3),0_10px_20px_rgba(21,93,252,0.2),0_15px_40px_rgba(21,93,252,0.15),0_20px_60px_rgba(21,93,252,0.1)]"
        }`}
      >
        <FiList className={`mr-2.5 shrink-0 translate-y-[0.5px] text-[20px] transition-colors duration-300 ${isOpen ? "text-blue-600" : "text-gray-500"}`} />
        <span className="min-w-0 flex-1 truncate text-left text-base font-normal leading-6">
          {selectedText}
        </span>
        <FiChevronDown className={`ml-3 shrink-0 text-[20px] transition duration-300 ${isOpen ? "rotate-180 text-blue-600" : "text-gray-500"}`} />
      </button>

      <label
        id={`${id}-label`}
        htmlFor={id}
        className={`pointer-events-none absolute left-2.5 top-0 z-30 -translate-y-1/2 bg-white px-1.25 text-xs transition-all duration-400 ease-out ${isOpen ? "text-blue-600" : "text-black"}`}
      >
        {label}
      </label>
      {isOpen && !isDisabled ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 overflow-hidden rounded-[12px] border border-blue-200 bg-white py-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
        >
          {options.map((option) => {
            const isSelected = option.value === String(currentValue);

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                onClick={() => selectOption(option.value)}
                className={`flex w-full items-center px-4 py-2.5 text-left text-base font-normal transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "text-black hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}

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
