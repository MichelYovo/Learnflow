"use client";

import Image from "next/image";
import { useAppTheme } from "@/theme/useAppTheme";

const WORDMARK_RATIO = 4.25;

export const LOGO_HEIGHT = {
  nav: 28,
  auth: 48,
  hero: 56,
} as const;

type LogoSize = keyof typeof LOGO_HEIGHT | number;

type Props = {
  /** nav 28 · auth 48 · hero 56 — ou une hauteur en px */
  height?: LogoSize;
  variant?: "auto" | "onDark" | "onLight" | "mark";
  /** Apparition (fade + scale), comme l’entrée mobile */
  animated?: boolean;
  /** Légère flottement, pour splash / profils */
  float?: boolean;
  className?: string;
};

export default function Logo({
  height = "auth",
  variant = "auto",
  animated = true,
  float = false,
  className = "",
}: Props) {
  const { darkMode } = useAppTheme();
  const isMark = variant === "mark";
  const useDark = variant === "onDark" || (variant === "auto" && darkMode);
  const displayH = typeof height === "number" ? height : LOGO_HEIGHT[height];
  const displayW = isMark ? displayH : Math.round(displayH * WORDMARK_RATIO);
  const src = isMark
    ? "/brand/logo-mark.png"
    : useDark
      ? "/brand/logo-dark.png"
      : "/brand/logo-light.png";

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        animated ? "lf-logo-in" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={src}
        alt="LearnFlow"
        width={displayW}
        height={displayH}
        className={`bg-transparent object-contain ${float ? "lf-logo-float" : ""}`}
        style={{
          height: displayH,
          width: isMark ? displayH : "auto",
          maxWidth: isMark ? displayH : "min(100%, 240px)",
        }}
        priority
      />
    </span>
  );
}
