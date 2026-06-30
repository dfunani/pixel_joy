import type { ComponentType } from "react";
import AceyDuceyGame from "@/games/acey-ducey/Game";

/**
 * Maps a game slug to its playable component.
 *
 * Statically imported (not via `next/dynamic`) so each game hydrates as part of
 * the game route's own bundle — there's no separate chunk or Suspense boundary
 * that could fail to load and leave the server-rendered board un-hydrated (dead
 * buttons). Because this module is only imported by the game route, the studio
 * gallery's bundle stays free of game code.
 */
const COMPONENTS: Record<string, ComponentType> = {
  "acey-ducey": AceyDuceyGame,
};

/** Renders a registered game's component by slug. */
export function GameHost({ slug }: { slug: string }) {
  const Game = COMPONENTS[slug];
  if (!Game) return null;
  return <Game />;
}
