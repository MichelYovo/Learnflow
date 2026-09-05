"use client";

import Image from "next/image";
import { avatarSrc } from "@/data/avatars";

export default function Avatar({
  avatarId,
  size = 48,
  initials,
  fallbackColor = "#1677FF",
  className = "",
}: {
  avatarId?: string;
  size?: number;
  initials?: string;
  fallbackColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-full bg-slate-100 ${className}`}
      style={{ width: size, height: size, background: fallbackColor }}
    >
      {avatarId ? (
        <Image
          src={avatarSrc(avatarId)}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-extrabold text-white">
          {(initials ?? "?").slice(0, 1)}
        </span>
      )}
    </div>
  );
}
