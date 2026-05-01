"use client";

import type { IconType } from "react-icons";

type ButtonBookmarkProps = {
  type: "button" | "submit" | "reset";
  text: string;
  icon: IconType;
  onClick?: () => void;
  disabled?: boolean;
  width: string;
  widthText: string;
  widthHoverDinamic: string;
};

export function ButtonBookmark({
  type,
  text,
  icon: Icon,
  onClick,
  disabled = false,
  width,
  widthText,
  widthHoverDinamic
}: ButtonBookmarkProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-[40px] border border-blue-600 bg-blue-600 transition duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${width}`}
    >
      <span className={`z-20 flex h-8.75 w-8.75 items-center justify-center overflow-hidden rounded-full bg-linear-to-b bg-white text-white transition-all duration-300 ${widthHoverDinamic}`}>
        <Icon className="text-[18px] text-blue-600" />
      </span>

      <p
        className={`z-10 flex h-full ${widthText} items-center justify-center text-[1.04em] text-white font-semibold transition-all duration-300 group-hover:w-0 group-hover:translate-x-2.5 group-hover:text-[0px]`}
      >
        {text}
      </p>
    </button>
  );
}