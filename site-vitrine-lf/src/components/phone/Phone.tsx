import type { ReactNode } from "react";

type Tilt = "none" | "left" | "right";

type Props = {
  children: ReactNode;
  /** Dark screen (Blitz) — home indicator becomes light. */
  dark?: boolean;
  tilt?: Tilt;
  float?: boolean;
  glow?: "blue" | "green" | "amber" | "red" | "none";
  className?: string;
  label?: string;
};

const TILT: Record<Tilt, string> = {
  none: "",
  left: "lf-phone-tilt-left",
  right: "lf-phone-tilt-right",
};

const GLOW: Record<NonNullable<Props["glow"]>, string> = {
  none: "",
  blue: "lf-phone-glow-blue",
  green: "lf-phone-glow-green",
  amber: "lf-phone-glow-amber",
  red: "lf-phone-glow-red",
};

export default function Phone({
  children,
  dark = false,
  tilt = "none",
  float = false,
  glow = "blue",
  className = "",
  label,
}: Props) {
  return (
    <figure
      className={`lf-phone ${TILT[tilt]} ${GLOW[glow]} ${float ? "lf-phone-float" : ""} ${className}`}
      aria-label={label ?? "Aperçu de l'application LearnFlow"}
    >
      <span className="lf-phone-btn lf-phone-btn-silent" aria-hidden />
      <span className="lf-phone-btn lf-phone-btn-vol-up" aria-hidden />
      <span className="lf-phone-btn lf-phone-btn-vol-down" aria-hidden />
      <span className="lf-phone-btn lf-phone-btn-power" aria-hidden />
      <div className="lf-phone-shell">
        <div className="lf-phone-island" aria-hidden>
          <span className="lf-phone-camera" />
        </div>
        <div className="lf-phone-screen" data-dark={dark ? "true" : "false"}>
          <div className="lf-phone-ui">
            {children}
          </div>
        </div>
        <span className={`lf-phone-home ${dark ? "lf-phone-home-light" : ""}`} aria-hidden />
        <span className="lf-phone-glare" aria-hidden />
      </div>
      {label ? <figcaption className="sr-only">{label}</figcaption> : null}
    </figure>
  );
}
