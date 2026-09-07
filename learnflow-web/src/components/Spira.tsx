"use client";

import Image from "next/image";
import { resolveSpiraScene, type SpiraMoodId, type SpiraScene } from "@/data/spira";
import { useAppTheme } from "@/theme/useAppTheme";

const ASSETS: Record<SpiraMoodId, string> = {
  joyeux: "/spira/joyeux.png",
  calme: "/spira/calme.png",
  confiant: "/spira/confiant.png",
  triste: "/spira/triste.png",
  enerve: "/spira/enerve.png",
  timide: "/spira/timide.png",
  surpris: "/spira/surpris.png",
  neutre: "/spira/neutre.png",
  determine: "/spira/determine.png",
  fatigue: "/spira/fatigue.png",
};

type Props = {
  mood?: SpiraMoodId;
  scene?: SpiraScene;
  size?: number;
  message?: string;
  animated?: boolean;
};

export default function Spira({ mood, scene, size = 64, message, animated = true }: Props) {
  const { colors } = useAppTheme();
  const fromScene = scene ? resolveSpiraScene(scene) : null;
  const id = mood ?? fromScene?.mood ?? "neutre";
  const text = message === "" ? undefined : (message ?? fromScene?.message);
  const bob = animated ? (size >= 72 ? "lf-spira-bob" : "lf-spira-bob-sm") : "";

  return (
    <div className="flex flex-col items-center gap-2 overflow-visible">
      <div className={`lf-spira-3d overflow-visible ${bob}`}>
        <Image
          src={ASSETS[id]}
          alt={`Spira ${id}`}
          width={size}
          height={size}
          className="bg-transparent object-contain"
          style={{ width: size, height: size, background: "transparent" }}
          priority={size >= 80}
        />
      </div>
      {text ? (
        <p
          className="max-w-xs rounded-[20px] border px-4 py-3 text-center text-base font-bold leading-snug"
          style={{ color: colors.textDark, background: colors.white, borderColor: colors.border }}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}
