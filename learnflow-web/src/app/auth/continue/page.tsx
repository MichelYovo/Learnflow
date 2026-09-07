"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Page } from "@/components/ui";
import { savePendingAuth } from "@/lib/pendingAuth";
import { getBrowserSupabase } from "@/lib/supabase";

export default function AuthContinuePage() {
  const router = useRouter();
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
      setMessage(`Compte sélectionné : ${user.email}. Envoi du code…`);
      router.replace(`/otp?email=${encodeURIComponent(user.email)}&flow=google`);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <Page className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <Logo height="auth" />
      <p className="text-sm font-bold text-slate-500">{message}</p>
    </Page>
  );
}
