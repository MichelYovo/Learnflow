"use client";

import Image from "next/image";
import { useAppTheme } from "@/theme/useAppTheme";

export default function Logo({ height = 36, dark }: { height?: number; dark?: boolean }) {
  const { darkMode } = useAppTheme();
  const useDark = dark ?? darkMode;
  return (
    <Image
      src={useDark ? "/brand/logo-dark.png" : "/brand/logo-light.png"}
      alt="LearnFlow"
      width={Math.round(height * 4.2)}
      height={height}
      className="w-auto"
      style={{ height }}
      priority
    />
  );
}
