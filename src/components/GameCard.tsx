import Link from "next/link";
import type { GameMeta } from "@/games/types";
import { ACCENTS } from "@/lib/accents";

export function GameCard({ meta, index }: { meta: GameMeta; index: number }) {
  const accent = ACCENTS[meta.accent];
  const disabled = meta.comingSoon;

  const inner = (
    <div
      className={`group pj-rise relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface/80 p-5 backdrop-blur transition-transform duration-300 ${accent.border} ${
        disabled ? "opacity-55" : "cursor-pointer hover:-translate-y-1.5"
      }`}
      style={{ animationDelay: `${Math.min(index * 0.06, 0.5)}s` }}
    >
      {/* Glow that blooms on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `0 0 40px -8px ${accent.hex}` }}
      />

      <div className="mb-4 flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-3xl ${accent.gradient}`}
        >
          <span className="drop-shadow">{meta.icon}</span>
        </div>
        <div className="flex gap-1.5">
          {meta.isNew && !disabled && (
            <span className="font-pixel rounded-md bg-pink/20 px-2 py-1 text-[8px] text-pink">
              NEW
            </span>
          )}
          {disabled && (
            <span className="font-pixel rounded-md bg-surface-2 px-2 py-1 text-[8px] text-muted">
              SOON
            </span>
          )}
        </div>
      </div>

      <h3 className={`font-pixel text-sm leading-relaxed ${accent.text}`}>
        {meta.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted">{meta.tagline}</p>

      <div className="mt-4 flex items-center gap-3 text-[11px] text-muted/80">
        <span className={`rounded-full px-2 py-0.5 ${accent.bgSoft} ${accent.text}`}>
          {meta.category}
        </span>
        <span>{meta.era}</span>
        <span className="ml-auto tabular-nums">~{meta.minutes} min</span>
      </div>

      {!disabled && (
        <div
          className={`mt-4 flex items-center gap-1 font-pixel text-[9px] ${accent.text} opacity-0 transition-opacity group-hover:opacity-100`}
        >
          PLAY <span aria-hidden>▶</span>
        </div>
      )}
    </div>
  );

  if (disabled) return <div className="h-full">{inner}</div>;

  return (
    <Link href={`/games/${meta.slug}`} className="h-full">
      {inner}
    </Link>
  );
}
