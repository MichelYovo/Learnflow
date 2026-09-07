"use client";

import Image from "next/image";
import { avatarSrc } from "@/data/avatars";

export default function Avatar({
  avatarId,
  size = 48,
  initials,
  fallbackColor = "#1677FF",
  selected,
  className = "",
}: {
  avatarId?: string;
  size?: number;
  initials?: string;
  fallbackColor?: string;
  selected?: boolean;
  className?: string;
}) {
  const ring = Math.max(2.5, size * 0.045);

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <div
        className="overflow-hidden rounded-full"
        style={{
          width: size,
          height: size,
          background: avatarId ? "transparent" : fallbackColor,
          boxShadow: avatarId ? "0 3px 10px rgba(15, 23, 42, 0.18)" : undefined,
        }}
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
            {(initials ?? "?").slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      {selected ? (
        <span
          className="pointer-events-none absolute rounded-full border-[#1677FF]"
          style={{
            top: -3,
            left: -3,
            width: size + 6,
            height: size + 6,
            borderWidth: ring,
          }}
        />
      ) : null}
    </div>
  );
}
