type Tab = "Accueil" | "Cours" | "Ligue" | "Profil";

const TABS: { name: Tab; label: string; icon: string; fill: string }[] = [
  { name: "Accueil", label: "Accueil", icon: "/icons/home.png", fill: "/icons/home-fill.png" },
  { name: "Cours", label: "Cours", icon: "/icons/book.png", fill: "/icons/book-fill.png" },
  { name: "Ligue", label: "Ligues", icon: "/icons/trophy.png", fill: "/icons/trophy-fill.png" },
  { name: "Profil", label: "Profil", icon: "/icons/user.png", fill: "/icons/user-fill.png" },
];

export function StatusBar({ light = false }: { light?: boolean }) {
  const color = light ? "#FFFFFF" : "#0F172A";
  return (
    <div className="flex h-[54px] items-end justify-between px-7 pb-1.5" style={{ color }}>
      <span className="text-[15px] font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="12" viewBox="0 0 17 12" fill={color} aria-hidden>
          <rect x="0" y="7" width="3" height="5" rx="0.6" />
          <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.6" />
          <rect x="9" y="2" width="3" height="10" rx="0.6" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.6" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={color} aria-hidden>
          <path d="M8 2.2c2.4 0 4.6.9 6.3 2.4l-.9.9A7.2 7.2 0 0 0 8 3.6 7.2 7.2 0 0 0 2.6 5.5l-.9-.9A8.8 8.8 0 0 1 8 2.2Zm0 3.1c1.5 0 2.9.6 3.9 1.6l-.9.9A4.3 4.3 0 0 0 8 6.6c-1.1 0-2.1.4-2.9 1.2l-.9-.9A5.7 5.7 0 0 1 8 5.3Zm0 3.2a2 2 0 0 1 1.4.6L8 11 6.6 9.1A2 2 0 0 1 8 8.5Z" />
        </svg>
        <span className="relative ml-0.5 inline-flex h-[12px] w-[25px] items-center rounded-[4px] border" style={{ borderColor: light ? "rgba(255,255,255,.45)" : "rgba(15,23,42,.35)" }}>
          <span className="ml-[1px] h-[8px] w-[17px] rounded-[2px]" style={{ background: light ? "#fff" : "#0F172A" }} />
        </span>
      </div>
    </div>
  );
}

export function TabBar({ active }: { active: Tab }) {
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);
  return (
    <div className="relative mt-auto bg-white pt-9">
      <div className="flex items-end border-t border-[#E7E5E4] pb-2">
        {left.map((tab) => (
          <TabItem key={tab.name} tab={tab} focused={active === tab.name} />
        ))}
        <div className="flex min-h-14 flex-1 justify-center" />
        {right.map((tab) => (
          <TabItem key={tab.name} tab={tab} focused={active === tab.name} />
        ))}
      </div>
      <div className="lf-phone-mark pointer-events-none absolute left-1/2 top-0 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-8 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-white shadow-[0_8px_24px_rgba(15,23,42,0.14)]">
        <img src="/brand/logo-mark.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
      </div>
    </div>
  );
}

function TabItem({
  tab,
  focused,
}: {
  tab: (typeof TABS)[number];
  focused: boolean;
}) {
  const color = focused ? "#1677FF" : "#A8A29E";
  return (
    <div className="flex min-h-14 min-w-0 flex-1 flex-col items-center justify-end pb-0.5">
      <img
        src={focused ? tab.fill : tab.icon}
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 object-contain"
        style={{ filter: focused ? "none" : "grayscale(1) opacity(.7)" }}
      />
      <span className="mt-0.5 w-full text-center text-[12px]" style={{ color, fontWeight: focused ? 700 : 500 }}>
        {tab.label}
      </span>
      <span className="mt-[3px] h-[5px] w-[5px] rounded-full" style={{ background: focused ? "#1677FF" : "transparent" }} />
    </div>
  );
}
