import { ReactNode } from "react";
import Link from "next/link";
import type { GameMeta } from "@/games/types";
import { ACCENTS } from "@/lib/accents";
import { Logo } from "./Logo";

/**
 * The chrome around any game: a back-to-arcade bar plus a CRT "cabinet screen"
 * that frames the game's own UI. Individual games render their board as
 * `children` and stay focused on gameplay.
 */
export function GameShell({
  meta,
  children,
}: {
  meta: GameMeta;
  children: ReactNode;
}) {
  const accent = ACCENTS[meta.accent];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-pixel text-[9px] text-muted transition-colors hover:text-foreground"
        >
          ◀ ARCADE
        </Link>
        <Logo className="text-[11px]" />
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-16">
        <div className="mb-6 text-center">
          <h1 className={`font-pixel text-xl ${accent.text} neon`}>
            {meta.title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            {meta.description}
          </p>
        </div>

        <div
          className="scanlines relative overflow-hidden rounded-3xl border bg-surface/70 p-6 backdrop-blur sm:p-10"
          style={{
            borderColor: accent.hex + "66",
            boxShadow: `0 0 60px -20px ${accent.hex}`,
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
