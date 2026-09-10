"use client";

import LogoIntro from "@/components/LogoIntro";

/** Prévisualisation bouclée de l’intro logo. Ouvrir /intro */
export default function IntroPreviewPage() {
  return (
    <div className="lf-boot lf-boot-film">
      <LogoIntro fill loop />
    </div>
  );
}
