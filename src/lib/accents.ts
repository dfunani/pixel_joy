import type { GameAccent } from "@/games/types";

/**
 * Maps an accent key to a bundle of static Tailwind classes + raw color.
 *
 * Tailwind can't see dynamically-built class names, so every variant is spelled
 * out here as a literal string. Adding an accent means adding one entry.
 */
export interface AccentStyle {
  /** Solid text color, e.g. text-green */
  text: string;
  /** Border color */
  border: string;
  /** Soft translucent background tint */
  bgSoft: string;
  /** Gradient used for hero glyphs / buttons */
  gradient: string;
  /** Raw hex, for inline glows and canvas */
  hex: string;
}

export const ACCENTS: Record<GameAccent, AccentStyle> = {
  pink: {
    text: "text-pink",
    border: "border-pink/50",
    bgSoft: "bg-pink/10",
    gradient: "from-pink to-purple",
    hex: "#ff2e88",
  },
  cyan: {
    text: "text-cyan",
    border: "border-cyan/50",
    bgSoft: "bg-cyan/10",
    gradient: "from-cyan to-blue",
    hex: "#22e0ff",
  },
  yellow: {
    text: "text-yellow",
    border: "border-yellow/50",
    bgSoft: "bg-yellow/10",
    gradient: "from-yellow to-pink",
    hex: "#ffd23f",
  },
  green: {
    text: "text-green",
    border: "border-green/50",
    bgSoft: "bg-green/10",
    gradient: "from-green to-cyan",
    hex: "#3df58a",
  },
  purple: {
    text: "text-purple",
    border: "border-purple/50",
    bgSoft: "bg-purple/10",
    gradient: "from-purple to-pink",
    hex: "#9d5cff",
  },
  blue: {
    text: "text-blue",
    border: "border-blue/50",
    bgSoft: "bg-blue/10",
    gradient: "from-blue to-cyan",
    hex: "#4d7cff",
  },
};
