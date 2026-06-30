"use client";

import { useMemo, useState } from "react";
import type { GameCategory, GameMeta } from "@/games/types";
import { GameCard } from "./GameCard";

type Filter = "All" | GameCategory;

export function StudioGallery({ games }: { games: GameMeta[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const categories = useMemo<Filter[]>(() => {
    const set = new Set<GameCategory>(games.map((g) => g.category));
    return ["All", ...Array.from(set).sort()];
  }, [games]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return games.filter((g) => {
      const matchCat = filter === "All" || g.category === filter;
      const matchQ =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.tagline.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [games, filter, query]);

  return (
    <section id="games" className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-pixel text-base text-foreground">
          THE <span className="text-cyan neon">ARCADE</span>
        </h2>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games…"
          className="w-full rounded-lg border border-pjborder bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-purple sm:w-56"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-pixel rounded-lg px-3 py-2 text-[9px] transition-colors ${
                active
                  ? "bg-purple text-white"
                  : "bg-surface text-muted hover:text-foreground"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-muted">
          No games match that. More are always on the way.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((meta, i) => (
            <GameCard key={meta.slug} meta={meta} index={i} />
          ))}
        </div>
      )}

      {/* A teaser tile hinting at the growing catalog */}
      <div className="pj-fade mt-5 rounded-2xl border border-dashed border-pjborder/70 px-6 py-8 text-center">
        <p className="font-pixel text-[10px] text-muted">MORE GAMES LOADING…</p>
        <p className="mt-2 text-sm text-muted/70">
          PixelJoy is growing toward 100+ hand-crafted classics.
        </p>
      </div>
    </section>
  );
}
