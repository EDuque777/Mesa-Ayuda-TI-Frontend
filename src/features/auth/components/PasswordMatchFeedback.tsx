"use client";

import { AnimatePresence, motion } from "motion/react";

interface PasswordMatchFeedbackProps {
  show: boolean;
  isMatch: boolean;
}

export function PasswordMatchFeedback({
  show,
  isMatch,
}: PasswordMatchFeedbackProps) {
  return (
    <div className="relative h-5 w-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {show && (
          <motion.p
            key={isMatch ? "match" : "mismatch"}
            className={`absolute inset-0 text-sm font-semibold ${
              isMatch ? "text-emerald-600" : "text-red-600"
            }`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {isMatch
              ? "Las contraseñas coinciden."
              : "Las contraseñas no coinciden."}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
