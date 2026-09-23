type Props = {
  size?: "nav" | "footer" | "mark" | "hero";
  /** onDark = blanc / clair · onLight = bleu marque (ou ink en thème clair) */
  variant?: "onDark" | "onLight" | "mark" | "auto";
  className?: string;
  priority?: boolean;
};

const HEIGHT: Record<NonNullable<Props["size"]>, number> = {
  nav: 36,
  footer: 40,
  mark: 28,
  hero: 56,
};

/**
 * Logo LearnFlow plat (pas de dégradé) — livre + play + wordmark.
 * Couleur via currentColor / classes thème.
 */
export default function BrandLogo({
  size = "nav",
  variant = "auto",
  className = "",
}: Props) {
  const h = HEIGHT[size];
  const markOnly = size === "mark" || variant === "mark";
  const colorClass =
    variant === "onDark"
      ? "text-white"
      : variant === "onLight"
        ? "text-[var(--lf-brand)]"
        : "text-[var(--lf-logo)]";

  if (markOnly) {
    return (
      <svg
        width={h}
        height={h}
        viewBox="0 0 40 40"
        className={`${colorClass} ${className}`.trim()}
        aria-hidden
        focusable="false"
      >
        <path
          d="M8 10.5c0-1.4.8-2.6 2-3.2L18.5 3.5a2.4 2.4 0 0 1 2.2 0L29 7.3c1.2.6 2 1.8 2 3.2V29c0 1.5-1.2 2.7-2.7 2.7H10.7C9.2 31.7 8 30.5 8 29V10.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M17 15.2v9.6l8.2-4.8L17 15.2Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      height={h}
      viewBox="0 0 220 40"
      className={`h-[${h}px] w-auto ${colorClass} ${className}`.trim()}
      style={{ height: h, width: "auto" }}
      role="img"
      aria-label="LearnFlow"
      focusable="false"
    >
      <path
        d="M6 9.8c0-1.2.7-2.3 1.8-2.8L15.2 3.4a2.1 2.1 0 0 1 1.9 0L25 7c1 .5 1.7 1.6 1.7 2.8V27.8c0 1.3-1 2.3-2.3 2.3H8.3C7 30.1 6 29.1 6 27.8V9.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M14 14.2v8.4l7.2-4.2-7.2-4.2Z" fill="currentColor" />
      <text
        x="38"
        y="27"
        fill="currentColor"
        fontFamily="var(--font-poppins), ui-sans-serif, system-ui, sans-serif"
        fontSize="22"
        fontWeight="800"
        letterSpacing="-0.04em"
      >
        Learnflow
      </text>
    </svg>
  );
}
