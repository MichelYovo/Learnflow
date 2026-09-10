"use client";

type Props = {
  width?: number;
  /** Plein écran, vidéo originale (début néon authentique). */
  fill?: boolean;
  loop?: boolean;
  onEnded?: () => void;
};

/** Intro logo : fichier source, sans détourage (évite trous et ombres noires). */
export default function LogoIntro({ width = 420, fill = false, loop = false, onEnded }: Props) {
  return (
    <video
      src="/brand/logo-anim.mp4?v=4"
      autoPlay
      muted
      playsInline
      loop={loop}
      onEnded={onEnded}
      preload="auto"
      className="pointer-events-none select-none"
      style={
        fill
          ? { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 38%" }
          : { width, height: Math.round(width / (1280 / 640)), objectFit: "cover", objectPosition: "center 38%" }
      }
    />
  );
}
