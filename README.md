# PixelJoy 🕹️

A studio of beautifully crafted common and retro games. One place, every classic
worth replaying — pick a game, press start, find your joy.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind v4**, and
**Motion** for animation.

## Getting started

```bash
npm run dev     # http://localhost:3000
npm run build   # production build + typecheck
npm run lint
```

## Architecture

The studio is built around a **game registry** so the catalog can grow to 100+
titles without touching the studio or routing code.

```
src/
  app/
    page.tsx                 # the studio gallery (home)
    games/[slug]/page.tsx    # one route serves every game, by slug
  components/                # studio chrome + shared UI (cards, hero, shell)
  games/
    types.ts                 # GameMeta + GameEntry contracts
    registry.ts              # the master list of games (add yours here)
    acey-ducey/              # one folder per game
      meta.ts                #   serializable metadata for the gallery
      logic.ts               #   pure, testable game rules (no React)
      Game.tsx               #   the playable component (default export)
      PlayingCard.tsx        #   game-specific UI pieces
  lib/accents.ts             # accent-color → static Tailwind classes
```

A game's code is loaded with a **dynamic import**, so each game's bundle is only
fetched when someone actually plays it.

## Adding a new game

1. Create `src/games/<slug>/`.
2. Add `meta.ts` exporting a `GameMeta` (title, tagline, category, `accent`, etc.).
3. Build the game in `Game.tsx` with a **default export** React component. Keep
   the rules in a side-effect-free `logic.ts` so they stay testable.
4. Register it in `src/games/registry.ts`:

   ```ts
   import { myGameMeta } from "./my-game/meta";

   export const GAMES: GameEntry[] = [
     // ...
     { meta: myGameMeta, load: () => import("./my-game/Game") },
   ];
   ```

That's it — the gallery, search, category filters, routing, and the CRT
game-screen chrome (`GameShell`) all pick it up automatically.

### Design conventions

- **Accents**: pick one of the neon keys in `src/lib/accents.ts`
  (`pink`, `cyan`, `yellow`, `green`, `purple`, `blue`). Use the static class
  bundles from `ACCENTS[accent]` rather than building class names dynamically —
  Tailwind only sees literal strings.
- **Pixel font** via the `font-pixel` utility; `neon` adds the glow text-shadow.
- **State**: never nest `setState` calls inside another updater. React
  StrictMode double-invokes updaters, which double-applies side effects. Compute
  next state from values in scope and call each setter once (see
  `acey-ducey/Game.tsx`).

## Games

| Game       | Category | Origin       | Status |
| ---------- | -------- | ------------ | ------ |
| Acey Ducey | Card     | 1970s BASIC  | ✅ Live |
