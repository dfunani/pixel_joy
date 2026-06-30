/**
 * Acey Ducey — pure game logic.
 *
 * Origin: a 1970s BASIC type-in game. The dealer turns up two cards; you bet
 * on whether the next card's rank falls strictly between them. Aces are high.
 *
 * Everything here is side-effect free so it can be unit-tested and driven by
 * the React component without entangling rendering and rules.
 */

export type Suit = "♠" | "♥" | "♦" | "♣";

/** Numeric rank, 2–14 (Jack 11, Queen 12, King 13, Ace 14 — aces high). */
export type Rank = number;

export interface Card {
  rank: Rank;
  suit: Suit;
}

export const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
export const STARTING_BANKROLL = 100;

/** Build an ordered 52-card deck. */
export function freshDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

/** Fisher–Yates shuffle, returning a new array. */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Human-readable rank label for display. */
export function rankLabel(rank: Rank): string {
  switch (rank) {
    case 11:
      return "J";
    case 12:
      return "Q";
    case 13:
      return "K";
    case 14:
      return "A";
    default:
      return String(rank);
  }
}

export function isRed(suit: Suit): boolean {
  return suit === "♥" || suit === "♦";
}

/** Order two cards so the lower rank comes first (left), higher second (right). */
export function sortPair(a: Card, b: Card): [Card, Card] {
  return a.rank <= b.rank ? [a, b] : [b, a];
}

/**
 * Whether the third card wins for the player: its rank must be strictly
 * between the two dealer cards. Order of the dealer cards does not matter.
 */
export function isWinningCard(low: Card, high: Card, next: Card): boolean {
  const lo = Math.min(low.rank, high.rank);
  const hi = Math.max(low.rank, high.rank);
  return next.rank > lo && next.rank < hi;
}

/**
 * A "spread" of 1 (e.g. a 7 and an 8) is impossible to win and a pair is a
 * coin-flip-free dead hand. We surface this so the UI can warn the player.
 */
export function isDeadHand(a: Card, b: Card): boolean {
  return Math.abs(a.rank - b.rank) <= 1;
}
