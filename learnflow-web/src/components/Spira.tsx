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
};

export default function Spira({ mood, scene, size = 64, message }: Props) {
  const { colors } = useAppTheme();
  const fromScene = scene ? resolveSpiraScene(scene) : null;
  const id = mood ?? fromScene?.mood ?? "neutre";
  const text = message === "" ? undefined : (message ?? fromScene?.message);

  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        src={ASSETS[id]}
        alt={`Spira ${id}`}
        width={size}
        height={size}
        className="object-contain drop-shadow-sm"
        style={{ width: size, height: size }}
        priority={size >= 80}
      />
      {text ? (
        <p
          className="max-w-xs text-center text-sm font-semibold leading-snug"
          style={{ color: colors.textSecondary }}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}
