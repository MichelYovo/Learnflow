"use client";

import { useState } from "react";
import { PROGRAMME_3EME, PROGRAMME_TLE } from "@/data/seed";

export default function ProgrammeBrowser() {
  const [track, setTrack] = useState<"college" | "lycee">("college");
  const programme = track === "college" ? PROGRAMME_3EME : PROGRAMME_TLE;
  const chapters = programme.reduce((n, s) => n + s.chapters.length, 0);
  const lessons = programme.reduce((n, s) => n + s.chapters.reduce((a, c) => a + c.lessons, 0), 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-2xl border-2 border-[#F0EFEE] bg-white p-1">
          <button
            type="button"
            onClick={() => setTrack("college")}
            className={`rounded-xl px-4 py-2 text-sm font-extrabold ${track === "college" ? "bg-[#1677FF] text-white" : "text-[#64748B]"}`}
          >
            Collège (3ème)
          </button>
          <button
            type="button"
            onClick={() => setTrack("lycee")}
            className={`rounded-xl px-4 py-2 text-sm font-extrabold ${track === "lycee" ? "bg-[#1677FF] text-white" : "text-[#64748B]"}`}
          >
            Lycée (Tle D)
          </button>
        </div>
        <p className="text-sm font-semibold text-[#64748B]">
          {programme.length} matières · {chapters} chapitres · {lessons} leçons
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {programme.map((subject) => (
          <article key={subject.id} className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ background: subject.color }} />
              <h2 className="font-black text-[#1C1917]">{subject.label}</h2>
              <span className="ml-auto text-xs font-extrabold text-[#64748B]">
                {subject.chapters.length} chapitres
              </span>
            </div>
            <ul className="space-y-2">
              {subject.chapters.map((chapter) => (
                <li key={chapter.id} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: subject.bg }}>
                  <span className="text-sm font-bold text-[#1C1917]">{chapter.title}</span>
                  <span className="text-xs font-extrabold text-[#64748B]">{chapter.lessons} leçons</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
