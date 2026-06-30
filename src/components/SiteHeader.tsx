import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <Logo className="text-sm" />
      <a
        href="#games"
        className="font-pixel text-[9px] text-muted transition-colors hover:text-cyan"
      >
        ARCADE
      </a>
    </header>
  );
}
