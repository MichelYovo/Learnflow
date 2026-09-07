"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Spira from "@/components/Spira";
import { AuthStage, Page, PrimaryButton } from "@/components/ui";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";

export default function SuccessPage() {
  const router = useRouter();
  const login = useLearnFlowStore((s) => s.login);

  useEffect(() => {
    login();
  }, [login]);

  return (
    <Page>
      <AuthStage>
        <div className="lf-slide-in w-full text-center">
          <Logo height="hero" float />
          <div className="mt-4">
            <Spira scene="auth.success" size={120} />
          </div>
          <h1 className="mt-4 text-2xl font-black">Compte prêt</h1>
          <div className="mt-8">
            <PrimaryButton onClick={() => router.replace("/focus")}>Entrer dans LearnFlow</PrimaryButton>
          </div>
        </div>
      </AuthStage>
    </Page>
  );
}
