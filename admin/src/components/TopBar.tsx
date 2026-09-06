export default function TopBar({ title, email }: { title: string; email: string }) {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-[#F0EFEE] bg-white/85 px-6 backdrop-blur-xl">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#1677FF]">Back-office</p>
        <h1 className="text-lg font-black tracking-tight text-[#1C1917]">{title}</h1>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border-2 border-[#F0EFEE] bg-[#FAFAF9] px-3 py-1.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1677FF] text-xs font-black text-white">
          AD
        </span>
        <div className="hidden sm:block">
          <p className="text-xs font-extrabold text-[#1C1917]">Administrateur</p>
          <p className="text-[11px] font-semibold text-[#64748B]">{email}</p>
        </div>
      </div>
    </header>
  );
}
