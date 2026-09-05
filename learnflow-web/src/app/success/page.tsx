"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spira from "@/components/Spira";
import { Page, PrimaryButton } from "@/components/ui";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";

export default function SuccessPage() {
  const router = useRouter();
  const login = useLearnFlowStore((s) => s.login);

  useEffect(() => {
    login();
  }, [login]);

  return (
    <Page className="flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <Spira scene="auth.success" size={120} />
        <h1 className="mt-4 text-2xl font-black">Compte prêt</h1>
        <div className="mt-8">
          <PrimaryButton onClick={() => router.replace("/focus")}>Entrer dans LearnFlow</PrimaryButton>
        </div>
      </div>
    </Page>
  );
}
