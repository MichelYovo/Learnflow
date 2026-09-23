import Image from "next/image";

const SIZES = {
  /** Aligné sur le wordmark web (auth ~48 / hero ~56) */
  nav: {
    width: 240,
    height: 56,
    className: "h-11 w-auto max-w-[min(52vw,13.5rem)] sm:h-12 sm:max-w-[15rem] md:h-14 md:max-w-none",
  },
  footer: {
    width: 240,
    height: 56,
    className: "h-12 w-auto sm:h-14",
  },
  mark: { width: 36, height: 36, className: "h-9 w-9 object-contain" },
} as const;

type Props = {
  size?: keyof typeof SIZES;
  /** onDark = logo clair (header sombre) · onLight = logo sombre (fond clair) */
  variant?: "onDark" | "onLight" | "mark";
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({
  size = "nav",
  variant = "onLight",
  className = "",
  priority = false,
}: Props) {
  const s = SIZES[size];
  const mark = size === "mark" || variant === "mark";
  const onDark = variant === "onDark";
  const src = mark ? "/brand/logo-mark.png" : onDark ? "/brand/logo-dark.png" : "/brand/logo-light.png";
  return (
    <Image
      src={src}
      alt={mark ? "" : "LearnFlow"}
      width={s.width}
      height={s.height}
      priority={priority}
      className={`${s.className} object-contain ${className}`.trim()}
    />
  );
}
