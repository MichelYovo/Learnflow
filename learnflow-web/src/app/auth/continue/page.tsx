"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Page } from "@/components/ui";
import { advanceFromSession } from "@/lib/advanceAuth";
import { savePendingAuth } from "@/lib/pendingAuth";
import { getBrowserSupabase } from "@/lib/supabase";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";

export default function AuthContinuePage() {
  const router = useRouter();
  const applyCloudUser = useLearnFlowStore((s) => s.applyCloudUser);
  const [message, setMessage] = useState("Compte Google reconnu…");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = getBrowserSupabase();
      if (!supabase) {
        router.replace("/login?error=config");
        return;
      }
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user?.email) {
        router.replace("/login?error=google");
        return;
      }
      if (cancelled) return;
      savePendingAuth({ email: user.email, flow: "google", emailOtpVerified: false });
      setMessage("Connexion en cours…");
      await advanceFromSession(applyCloudUser, (path) => {
        if (!cancelled) router.replace(path);
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [applyCloudUser, router]);

  return (
    <Page className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <Logo height="auth" />
      <p className="text-sm font-bold text-slate-500">{message}</p>
    </Page>
  );
}
