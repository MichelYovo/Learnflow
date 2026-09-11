import { WEB_URL } from "../../lib/brand";

type Props = { compact?: boolean; align?: "start" | "center"; light?: boolean };

export default function WebCta({ compact = false, align = "start", light = false }: Props) {
  const btn = light
    ? "bg-white text-[#1677FF] hover:bg-[#E6F4FF]"
    : "bg-[#1677FF] text-white shadow-[0_8px_20px_rgba(22,119,255,.28)] hover:bg-[#155EEF]";

  return (
    <div className={`flex min-w-0 ${align === "center" ? "justify-center" : ""}`}>
      <a
        href={WEB_URL}
        className={`inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-sm font-extrabold ${btn}`}
      >
        {compact ? "Ouvrir l’app" : "Ouvrir LearnFlow"}
      </a>
    </div>
  );
}
