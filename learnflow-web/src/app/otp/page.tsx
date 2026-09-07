"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { AuthStage, Page, PrimaryButton } from "@/components/ui";
import { DEMO_OTP } from "@/lib/pin";
import { useAppTheme } from "@/theme/useAppTheme";

export default function OTPPage() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const sent = useRef(false);

  const submit = (value: string) => {
    if (sent.current) return;
    if (value !== DEMO_OTP) {
      setError("Code incorrect. Pour la démo, entre 123456.");
      return;
    }
    sent.current = true;
    router.replace("/success");
  };

  useEffect(() => {
    if (code.length === 6) submit(code);
  }, [code]);

  return (
    <Page>
      <AuthStage>
        <div className="w-full">
        <div className="mb-4 flex justify-center">
          <Logo height="auth" />
        </div>
        <h1 className="text-center text-2xl font-extrabold">Vérification</h1>
        <p className="mt-2 mb-6 text-center text-sm font-semibold" style={{ color: colors.textMuted }}>
          Entre le code à 6 chiffres. Pour la démo : {DEMO_OTP}
        </p>
        <input
          value={code}
          onChange={(e) => {
            setError("");
            sent.current = false;
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
          }}
          inputMode="numeric"
          autoFocus
          maxLength={6}
          className="mb-4 w-full rounded-2xl border-2 px-3 py-4 text-center text-[22px] font-extrabold tracking-[0.18em] outline-none sm:px-4 sm:py-[18px] sm:text-[28px] sm:tracking-[0.4em]"
          style={{ borderColor: colors.mathsBorder, background: colors.white, color: colors.textDark }}
          placeholder="123456"
        />
        {error ? <p className="mb-3 text-center text-sm font-bold text-red-500">{error}</p> : null}
        <PrimaryButton onClick={() => submit(code)}>Valider</PrimaryButton>
        </div>
      </AuthStage>
    </Page>
  );
}
