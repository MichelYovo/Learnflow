"use client";

const LOGOS: Record<string, string> = {
  maths: "/icons/subjects/maths.png",
  svt: "/icons/subjects/svt.png",
  pc: "/icons/subjects/pc.png",
  hg: "/icons/subjects/hg.png",
  fr: "/icons/subjects/fr.png",
  ang: "/icons/subjects/ang.png",
  edhc: "/icons/subjects/edhc.png",
  philo: "/icons/subjects/philo.png",
};

export function subjectLogoSrc(id?: string | null) {
  if (!id) return LOGOS.maths;
  return LOGOS[id] ?? LOGOS.maths;
}

export default function SubjectLogo({
  id,
  size = 28,
  className = "",
}: {
  id?: string | null;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={subjectLogoSrc(id)}
      alt=""
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}
