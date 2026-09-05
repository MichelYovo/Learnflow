"use client";

import { useRouter } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import Spira from "@/components/Spira";
import { Page, PrimaryButton } from "@/components/ui";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

const BENEFITS: { icon: IconName; title: string; body: string }[] = [
  { icon: "bell-off", title: "Plus de pings", body: "WhatsApp, TikTok et les autres restent silencieux le temps de la séance." },
  { icon: "book", title: "Immersion", body: "Tu restes dans tes fiches et tes quiz, sans basculer vers les réseaux." },
  { icon: "timer", title: "Tu restes maître", body: "Dès que tu as fini, tu désactives Ne pas déranger dans tes réglages." },
];

export default function FocusPage() {
  const { colors, darkMode } = useAppTheme();
  const dismiss = useLearnFlowStore((s) => s.dismissFocusPrompt);
  const router = useRouter();

  const enter = () => {
    dismiss();
    router.replace("/app");
  };

  return (
    <Page className="flex flex-col">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-10">
        <Spira scene="auth.focus" size={108} />
        <p className="mt-4 text-xs font-extrabold uppercase tracking-widest" style={{ color: colors.primary }}>
          Avant de réviser
        </p>
        <h1 className="mt-2 text-3xl font-black">Mode concentration</h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed" style={{ color: colors.textSecondary }}>
          Sur le web, coupe les notifications de l&apos;onglet et range le téléphone. Les réseaux peuvent attendre.
        </p>
        <div className="mt-6 space-y-3">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="flex gap-3 rounded-2xl border p-4"
              style={{ background: colors.white, borderColor: darkMode ? colors.border : colors.mathsBorder }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.mathsBg }}>
                <Icon name={item.icon} size={18} color={colors.primary} />
              </span>
              <div>
                <p className="text-sm font-extrabold">{item.title}</p>
                <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto space-y-3 pt-8">
          <PrimaryButton onClick={enter}>C&apos;est bon, je révise</PrimaryButton>
          <button type="button" onClick={enter} className="w-full py-2 text-sm font-extrabold" style={{ color: colors.textMuted }}>
            Plus tard
          </button>
        </div>
      </div>
    </Page>
  );
}
