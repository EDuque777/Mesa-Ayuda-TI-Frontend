"use client";

import React, { useRef } from "react";

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
};

export function GlowCard({
  children,
  className = "",
  glowColor = "21, 93, 252",
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--glow-x", `${x}%`);
    card.style.setProperty("--glow-y", `${y}%`);
    card.style.setProperty("--glow-opacity", "1");
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;

    if (!card) return;

    card.style.setProperty("--glow-opacity", "0");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--glow-x": "50%",
          "--glow-y": "50%",
          "--glow-opacity": "0",
          "--glow-color": glowColor,
        } as React.CSSProperties
      }
      className={`relative overflow-hidden rounded-[20px] bg-white p-1.25 shadow-2xl transition-transform duration-300 ease-out hover:scale-[1.01] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-(--glow-opacity) before:transition-opacity before:duration-500 before:content-[''] before:bg-[radial-gradient(350px_circle_at_var(--glow-x)_var(--glow-y),rgba(var(--glow-color),0.22),transparent_60%)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:p-0.5 after:opacity-(--glow-opacity) after:transition-opacity after:duration-500 after:content-[''] after:[background:radial-gradient(450px_circle_at_var(--glow-x)_var(--glow-y),rgba(var(--glow-color),0.9),transparent_55%)] after:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] after:mask-exclude ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
