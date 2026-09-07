"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { AuthStage, Page, PrimaryButton } from "@/components/ui";
import { settleVerifiedUser } from "@/lib/authFinish";
import { sendEmailOtp, verifyEmailOtp } from "@/lib/emailOtp";
import { loadPendingAuth } from "@/lib/pendingAuth";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

function OTPInner() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const params = useSearchParams();
  const applyCloudUser = useLearnFlowStore((s) => s.applyCloudUser);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("Envoi du code…");
  const [busy, setBusy] = useState(false);
  const sent = useRef(false);
  const sending = useRef(false);

  useEffect(() => {
    const pending = loadPendingAuth();
    const nextEmail = (params.get("email") || pending?.email || "").trim().toLowerCase();
    setEmail(nextEmail);
    if (!nextEmail.includes("@")) {
      setInfo("");
      setError("Adresse email manquante. Repars de la connexion.");
      return;
    }
    if (sending.current) return;
    sending.current = true;
    const shouldCreate = pending?.flow === "signup";
    void sendEmailOtp(nextEmail, {
      shouldCreateUser: shouldCreate,
      data: pending?.firstName
        ? {
            first_name: pending.firstName,
            last_name: pending.lastName ?? "",
            class_level: pending.classe ?? "",
          }
        : undefined,
    }).then((result) => {
      if (result.error) {
        setError(result.error);
        setInfo("");
        sending.current = false;
        return;
      }
      setInfo(`Un code à 6 chiffres a été envoyé à ${nextEmail}.`);
    });
  }, [params]);

  const afterVerify = async () => {
    const settled = await settleVerifiedUser();
    if (settled.next === "login") {
      router.replace(settled.error === "config" ? "/login?error=config" : "/login");
      return;
    }
    if (settled.next === "complete-profile") {
      router.replace("/complete-profile");
      return;
    }
    applyCloudUser(settled.user, { fresh: settled.fresh, authenticate: false });
    router.replace("/success");
  };

  const submit = async (value: string) => {
    if (sent.current || busy) return;
    if (value.length !== 6) {
      setError("Entre les 6 chiffres reçus par email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Adresse email manquante.");
      return;
    }
    sent.current = true;
    setBusy(true);
    setError("");
    const result = await verifyEmailOtp(email, value);
    if (result.error) {
      sent.current = false;
      setBusy(false);
      setError(result.error);
      return;
    }
    await afterVerify();
  };

  const resend = async () => {
    if (!email.includes("@") || busy) return;
    setError("");
    setBusy(true);
    const pending = loadPendingAuth();
    const result = await sendEmailOtp(email, { shouldCreateUser: pending?.flow === "signup" });
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo(`Nouveau code envoyé à ${email}.`);
  };

  return (
    <Page>
      <AuthStage>
        <div className="w-full">
          <div className="mb-4 flex justify-center">
            <Logo height="auth" />
          </div>
          <h1 className="text-center text-2xl font-extrabold">Vérification</h1>
          <p className="mt-2 mb-6 text-center text-sm font-semibold" style={{ color: colors.textMuted }}>
            {info || "Entre le code à 6 chiffres reçu par email."}
          </p>
          <input
            value={code}
            onChange={(e) => {
              setError("");
              sent.current = false;
              const next = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(next);
              if (next.length === 6) void submit(next);
            }}
            inputMode="numeric"
            autoFocus
            maxLength={6}
            className="mb-4 w-full rounded-2xl border-2 px-3 py-4 text-center text-[22px] font-extrabold tracking-[0.18em] outline-none sm:px-4 sm:py-[18px] sm:text-[28px] sm:tracking-[0.4em]"
            style={{ borderColor: colors.mathsBorder, background: colors.white, color: colors.textDark }}
            placeholder="••••••"
          />
          {error ? <p className="mb-3 text-center text-sm font-bold text-red-500">{error}</p> : null}
          <PrimaryButton onClick={() => void submit(code)} disabled={busy}>
            {busy ? "Vérification…" : "Valider"}
          </PrimaryButton>
          <button
            type="button"
            onClick={() => void resend()}
            className="mt-4 block w-full text-center text-sm font-bold"
            style={{ color: colors.primary }}
          >
            Renvoyer le code
          </button>
        </div>
      </AuthStage>
    </Page>
  );
}

export default function OTPPage() {
  return (
    <Suspense>
      <OTPInner />
    </Suspense>
  );
}
