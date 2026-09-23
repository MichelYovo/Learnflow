import Image from "next/image";

const SIZES = {
  nav: { width: 180, height: 42, className: "h-8 w-auto max-w-[min(42vw,11rem)] sm:h-9 sm:max-w-none md:h-10" },
  footer: { width: 180, height: 42, className: "h-10 w-auto" },
  mark: { width: 28, height: 28, className: "h-7 w-7 object-contain" },
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
