/** Broad shelves used to group games in the studio. */
export type GameCategory = "Classic" | "Card" | "Arcade" | "Puzzle" | "Word";

/** Accent color key — must match a neon defined in globals.css / Tailwind theme. */
export type GameAccent = "pink" | "cyan" | "yellow" | "green" | "purple" | "blue";

/**
 * Lightweight, serializable metadata for a single game.
 *
 * Kept separate from the (client) component so the studio gallery and routing
 * can read it without pulling game logic into every page. Add a new game by
 * creating a folder under `src/games/<slug>/`, exporting a `meta` and a lazy
 * `component`, then registering it in `registry.ts`.
 */
export interface GameMeta {
  /** URL-safe identifier, also the route segment: /games/<slug>. */
  slug: string;
  title: string;
  /** One-line hook shown on the game card. */
  tagline: string;
  /** Longer description shown on the game's own screen. */
  description: string;
  category: GameCategory;
  accent: GameAccent;
  /** Emoji or short glyph used as the card's icon. */
  icon: string;
  /** Era flavor text, e.g. "1970s BASIC". */
  era: string;
  /** Rough minutes per session, for the card. */
  minutes: number;
  /** Marks the freshest additions. */
  isNew?: boolean;
  /** Hide from the gallery while in development. */
  comingSoon?: boolean;
}

/** A registered game: its metadata plus its (code-split) play component. */
