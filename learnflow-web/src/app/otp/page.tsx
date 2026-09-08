"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { AuthStage, Page, PrimaryButton } from "@/components/ui";
import { advanceFromSession } from "@/lib/advanceAuth";
import { loadPendingAuth, savePendingAuth, type AuthFlow } from "@/lib/pendingAuth";
import { sendSecureEmailOtp, verifySecureEmailOtp } from "@/lib/secureAuth";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local.slice(0, Math.min(2, local.length))}***@${domain}`;
}

function formatMmSs(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function OTPInner() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const params = useSearchParams();
  const applyCloudUser = useLearnFlowStore((s) => s.applyCloudUser);
  const [email, setEmail] = useState("");
  const [flow, setFlow] = useState<AuthFlow>("login");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("Envoi du code…");
  const [wait, setWait] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const started = useRef(false);
  const verifyingLock = useRef(false);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = window.setTimeout(() => setWait((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const pending = loadPendingAuth();
    const nextEmail = (params.get("email") || pending?.email || "").trim().toLowerCase();
    const nextFlow = (params.get("flow") as AuthFlow | null) || pending?.flow || "login";
    setEmail(nextEmail);
    setFlow(nextFlow);
    if (!nextEmail.includes("@")) {
      setInfo("");
      setError("Adresse email manquante. Repars de la connexion.");
      return;
    }

    void (async () => {
      setSending(true);
      const result = await sendSecureEmailOtp(nextEmail);
      setSending(false);
      if (result.retryAfterSeconds) setWait(result.retryAfterSeconds);
      if (result.error) {
        setError(result.error);
        setInfo(`Entre le code envoyé à ${maskEmail(nextEmail)} s’il est déjà arrivé.`);
        return;
      }
      setError("");
      setInfo(`Un code à 6 chiffres a été envoyé à ${maskEmail(nextEmail)}.`);
    })();
  }, [params]);

  const markVerified = () => {
    const pending = loadPendingAuth();
    if (pending) savePendingAuth({ ...pending, emailOtpVerified: true });
    else if (email.includes("@")) savePendingAuth({ email, flow, emailOtpVerified: true });
  };

  const submit = async (value: string) => {
    if (verifyingLock.current || verifying || sending) return;
    if (value.length !== 6) {
      setError("Entre les 6 chiffres reçus par email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Adresse email manquante.");
      return;
    }
    verifyingLock.current = true;
    setVerifying(true);
    setError("");
    const result = await verifySecureEmailOtp(email, value);
    if (result.error) {
      verifyingLock.current = false;
      setVerifying(false);
      setError(result.error);
      if (result.retryAfterSeconds) setWait(result.retryAfterSeconds);
      return;
    }
    markVerified();
    await advanceFromSession(applyCloudUser, (path) => router.replace(path));
  };

  const resend = async () => {
    if (!email.includes("@") || sending || wait > 0) return;
    setError("");
    setSending(true);
    const result = await sendSecureEmailOtp(email, { force: true });
    setSending(false);
    setWait(result.retryAfterSeconds ?? 60);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo(`Nouveau code envoyé à ${maskEmail(email)}.`);
  };

  return (
    <Page>
      <AuthStage>
        <div className="w-full">
          <div className="mb-4 flex justify-center">
            <Logo height="auth" />
          </div>
          <h1 className="text-center text-2xl font-extrabold">Entre le code</h1>
          <p className="mt-2 mb-6 text-center text-sm font-semibold" style={{ color: colors.textMuted }}>
            {info || "Le code à 6 chiffres arrive par email. Aucun lien à cliquer."}
          </p>
          <input
            value={code}
            onChange={(e) => {
              setError("");
              verifyingLock.current = false;
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
          <PrimaryButton onClick={() => void submit(code)} disabled={verifying || sending}>
            {verifying ? "Vérification…" : "Valider"}
          </PrimaryButton>
          <p className="mt-4 text-center text-sm font-bold" style={{ color: colors.textMuted }}>
            {wait > 0 ? (
              `Renvoyer le code dans ${formatMmSs(wait)}`
            ) : (
              <button
                type="button"
                onClick={() => void resend()}
                disabled={sending}
                className="font-bold"
                style={{ color: colors.primary }}
              >
                {sending ? "Envoi…" : "Renvoyer le code"}
              </button>
            )}
          </p>
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
