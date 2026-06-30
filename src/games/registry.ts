import type { GameMeta } from "./types";
import { aceyDuceyMeta } from "./acey-ducey/meta";

/**
 * Game *metadata* registry — intentionally component-free so importing it (e.g.
 * in the studio gallery) never pulls game code into that bundle.
 *
 * The playable components are wired up separately in
 * `@/components/GameHost`, which the game route renders.
 *
 * To add a game: create `src/games/<slug>/{meta.ts,Game.tsx,logic.ts}`, push
 * its meta here, and register the component in `GameHost`.
 */
export const GAME_META: GameMeta[] = [aceyDuceyMeta];

export function getGameMeta(slug: string): GameMeta | undefined {
  return GAME_META.find((m) => m.slug === slug);
}
