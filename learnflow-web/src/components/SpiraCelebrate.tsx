"use client";

type Props = {
  size?: number;
};

/** Spira 001 — perso seul, fond détouré, sans son. */
export default function SpiraCelebrate({ size = 220 }: Props) {
  return (
    <img
      src="/spira/celebrate.webp"
      alt=""
      width={size}
      height={size}
      draggable={false}
      className="pointer-events-none select-none bg-transparent object-contain"
      style={{ width: size, height: size, background: "transparent" }}
    />
  );
}
