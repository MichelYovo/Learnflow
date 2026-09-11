"use client";

import Spira from "@/components/Spira";
import type { AnalogieSpiraData } from "@/types/learnflow";
import { useAppTheme } from "@/theme/useAppTheme";

export default function AnalogieSpira({ analogie }: { analogie: AnalogieSpiraData }) {
  const { colors } = useAppTheme();
  return (
    <section className="rounded-3xl p-5" style={{ background: "#EEF4FF" }}>
      <p className="text-[17px] font-extrabold" style={{ color: colors.textDark }}>
        {analogie.titre}
      </p>
      <div className="mt-4 flex items-center gap-2.5 overflow-visible">
        <Spira scene="course.analogy" size={72} message="" />
        <div className="flex-1 rounded-[20px] px-4 py-3.5" style={{ background: colors.white }}>
          <p className="text-[16px] font-medium leading-6" style={{ color: colors.textDark }}>
            {analogie.parole}
          </p>
        </div>
      </div>
    </section>
  );
}
