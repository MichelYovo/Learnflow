"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Spira from "@/components/Spira";
import { PrimaryButton } from "@/components/ui";
import { useAppTheme } from "@/theme/useAppTheme";

export default function ParentsGatePage() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const challenge = useMemo(() => {
    const a = 6 + Math.floor(Math.random() * 4);
    const b = 6 + Math.floor(Math.random() * 4);
    return { a, b, answer: a * b };
  }, []);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-5.5rem)] max-w-md flex-col items-center justify-center px-6 text-center lg:min-h-dvh">
      <Spira scene={error ? "parents.error" : "parents.gate"} size={88} message="" />
      <h1 className="mt-3 text-2xl font-black">Sas parental</h1>
      <p className="mt-2 font-bold" style={{ color: colors.textMuted }}>
        Calcule {challenge.a} × {challenge.b}
      </p>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError(false);
        }}
        inputMode="numeric"
        className="mt-4 w-full rounded-2xl border px-4 py-4 text-center text-2xl font-black outline-none"
        style={{ borderColor: colors.mathsBorder, background: colors.white, color: colors.textDark }}
        placeholder="Résultat"
      />
      {error ? <p className="mt-2 text-sm font-bold text-red-500">Incorrect — réessaie</p> : null}
      <div className="mt-6 w-full">
        <PrimaryButton
          onClick={() => {
            if (Number(value) === challenge.answer) router.replace("/app/parents");
            else setError(true);
          }}
        >
          Entrer
        </PrimaryButton>
      </div>
    </div>
  );
}
