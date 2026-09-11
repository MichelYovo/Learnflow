import Phone from "../phone/Phone";
import { HomeMock, LeagueMock, QuizMock } from "../phone/screens";

export default function HeroPhones() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[640px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/[0.05] blur-3xl" />
      <div className="lf-hero-cluster relative flex items-end justify-center overflow-hidden pt-4 sm:pt-6 md:min-h-[520px] md:overflow-visible lg:min-h-[640px] xl:min-h-[680px]">
        <div
          className="absolute left-0 top-10 hidden origin-bottom md:block"
          style={{ transform: "rotate(-12deg) translateX(8px) translateY(48px) scale(0.82)" }}
        >
          <Phone glow="green" label="Quiz 10/10">
            <QuizMock />
          </Phone>
        </div>
        <div className="relative z-20">
          <Phone glow="blue" label="Accueil LearnFlow">
            <HomeMock />
          </Phone>
        </div>
        <div
          className="absolute right-0 top-10 hidden origin-bottom md:block"
          style={{ transform: "rotate(12deg) translateX(-8px) translateY(48px) scale(0.82)" }}
        >
          <Phone glow="amber" label="Ligues">
            <LeagueMock />
          </Phone>
        </div>
      </div>
    </div>
  );
}
