"use client";

import { AnimatePresence, motion } from "motion/react";
import type { IconType } from "react-icons";
import { ThreeBodyLoader } from "@/shared/ui/loaders/ThreeBodyLoader";

type ButtonBookmarkProps = {
  type: "button" | "submit" | "reset";
  text: string;
  icon: IconType;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
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
  isLoading = false,
  width,
  widthText,
  widthHoverDinamic
}: ButtonBookmarkProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-[40px] border border-blue-600 bg-blue-600 transition duration-300 active:scale-95 disabled:cursor-not-allowed ${width}`}
    >
      <span className={`z-20 flex h-8.75 w-8.75 items-center justify-center overflow-hidden rounded-full bg-linear-to-b bg-white text-white transition-all duration-300 ${widthHoverDinamic}`}>
        <span className="relative flex h-6 w-6 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <motion.span
                key="loader"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.72, rotate: -18 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.72, rotate: 18 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ThreeBodyLoader />
              </motion.span>
            ) : (
              <motion.span
                key="icon"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.72, rotate: -18 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.72, rotate: 18 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Icon className="text-[18px] text-blue-600" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </span>

      <p
        className={`z-10 flex h-full ${widthText} items-center justify-center text-[1.04em] text-white font-semibold transition-all duration-300 group-hover:w-0 group-hover:translate-x-2.5 group-hover:text-[0px]`}
      >
        {text}
      </p>
    </button>
  );
}
