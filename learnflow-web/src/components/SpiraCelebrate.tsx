"use client";

type Props = {
  size?: number;
  className?: string;
};

/** Spira 001 — perso seul, fond détouré, sans son. */
export default function SpiraCelebrate({ size = 220, className = "" }: Props) {
  return (
    <img
      src="/spira/celebrate.webp"
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={`pointer-events-none max-h-full max-w-full select-none bg-transparent object-contain ${className}`}
      style={{ width: size, height: size, maxHeight: "100%", maxWidth: "100%", background: "transparent" }}
    />
  );
}
