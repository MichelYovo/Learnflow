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
  const [busy, setBusy] = useState(false);
  const sent = useRef(false);

  useEffect(() => {
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
      const result = await sendSecureEmailOtp(nextEmail, {
        shouldCreateUser: nextFlow === "signup",
        data: pending?.firstName
          ? {
              first_name: pending.firstName,
              last_name: pending.lastName ?? "",
              class_level: pending.classe ?? "",
            }
          : undefined,
      });
      if (result.error) {
        setError(result.error);
        setInfo("");
        return;
      }
      const account =
        nextFlow === "google"
          ? `Compte Google sélectionné : ${nextEmail}.`
          : `Un code à 6 chiffres a été envoyé à ${nextEmail}.`;
      setInfo(`${account} Regarde aussi les spams.`);
    })();
  }, [params]);

  const markVerified = () => {
    const pending = loadPendingAuth();
    if (pending) savePendingAuth({ ...pending, emailOtpVerified: true });
    else if (email.includes("@")) savePendingAuth({ email, flow, emailOtpVerified: true });
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
    const result = await verifySecureEmailOtp(email, value);
    if (result.error) {
      sent.current = false;
      setBusy(false);
      setError(result.error);
      return;
    }
    markVerified();
    await advanceFromSession(applyCloudUser, (path) => router.replace(path));
  };

  const resend = async () => {
    if (!email.includes("@") || busy) return;
    setError("");
    setBusy(true);
    const pending = loadPendingAuth();
    const result = await sendSecureEmailOtp(email, {
      shouldCreateUser: (pending?.flow ?? flow) === "signup",
      force: true,
    });
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo(`Nouveau code envoyé à ${email}. Regarde aussi les spams.`);
  };

  return (
    <Page>
      <AuthStage>
        <div className="w-full">
          <div className="mb-4 flex justify-center">
            <Logo height="auth" />
          </div>
          <h1 className="text-center text-2xl font-extrabold">Vérification LearnFlow</h1>
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
