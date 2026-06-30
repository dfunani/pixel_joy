"use client";

import { Card, Rank, Suit, isRed, rankLabel } from "./logic";

/**
 * Pip layouts for number cards, expressed as [x, y] in the pip field where
 * x ∈ {0 = left column, 0.5 = center, 1 = right column} and y ∈ [0 (top), 1
 * (bottom)]. These mirror the arrangement on a standard French-suited deck.
 * Pips in the lower half (y > 0.5) are drawn upside-down, as on real cards.
 */
const PIP_LAYOUTS: Record<number, Array<[number, number]>> = {
  2: [
    [0.5, 0],
    [0.5, 1],
  ],
  3: [
    [0.5, 0],
    [0.5, 0.5],
    [0.5, 1],
  ],
  4: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  5: [
    [0, 0],
    [1, 0],
    [0.5, 0.5],
    [0, 1],
    [1, 1],
  ],
  6: [
    [0, 0],
    [1, 0],
    [0, 0.5],
    [1, 0.5],
    [0, 1],
    [1, 1],
  ],
  7: [
    [0, 0],
    [1, 0],
    [0.5, 0.25],
    [0, 0.5],
    [1, 0.5],
    [0, 1],
    [1, 1],
  ],
  8: [
    [0, 0],
    [1, 0],
    [0.5, 0.25],
    [0, 0.5],
    [1, 0.5],
    [0.5, 0.75],
    [0, 1],
    [1, 1],
  ],
  9: [
    [0, 0],
    [1, 0],
    [0, 0.333],
    [1, 0.333],
    [0.5, 0.5],
    [0, 0.667],
    [1, 0.667],
    [0, 1],
    [1, 1],
  ],
  10: [
    [0, 0],
    [1, 0],
    [0.5, 0.167],
    [0, 0.333],
    [1, 0.333],
    [0, 0.667],
    [1, 0.667],
    [0.5, 0.833],
    [0, 1],
    [1, 1],
  ],
};

// Map normalized coords into the printable pip field (percent of card box).
const FIELD = { left: 26, right: 74, top: 17, bottom: 83 };

function pipStyle([x, y]: [number, number]) {
  const left = FIELD.left + x * (FIELD.right - FIELD.left);
  const top = FIELD.top + y * (FIELD.bottom - FIELD.top);
  return {
    left: `${left}%`,
    top: `${top}%`,
    transform: `translate(-50%, -50%) rotate(${y > 0.5 ? 180 : 0}deg)`,
  };
}

function CardFace({ rank, suit }: { rank: Rank; suit: Suit }) {
  const colorClass = isRed(suit) ? "text-[#d5283f]" : "text-[#15132b]";
  const label = rankLabel(rank);

  return (
    <>
      {/* Corner indices: rank over suit, top-left and (rotated) bottom-right */}
      <Corner label={label} suit={suit} colorClass={colorClass} position="tl" />
      <Corner label={label} suit={suit} colorClass={colorClass} position="br" />

      {/* Center: pips for 2–10, a single large pip for the Ace, a letter for
          court cards. */}
      {rank >= 2 && rank <= 10 ? (
        <div className="absolute inset-0">
          {PIP_LAYOUTS[rank].map((pos, i) => (
            <span
              key={i}
              className={`absolute text-xl leading-none sm:text-2xl ${colorClass}`}
              style={pipStyle(pos)}
            >
              {suit}
            </span>
          ))}
        </div>
      ) : rank === 14 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-6xl sm:text-7xl ${colorClass}`}>{suit}</span>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span
            className={`font-pixel text-2xl leading-none sm:text-3xl ${colorClass}`}
          >
            {label}
          </span>
          <span className={`text-2xl sm:text-3xl ${colorClass}`}>{suit}</span>
        </div>
      )}
    </>
  );
}

function Corner({
  label,
  suit,
  colorClass,
  position,
}: {
  label: string;
  suit: Suit;
  colorClass: string;
  position: "tl" | "br";
}) {
  const place =
    position === "tl" ? "left-2 top-2" : "bottom-2 right-2 rotate-180";
  return (
    <div className={`absolute flex flex-col items-center ${place} ${colorClass}`}>
      <span className="font-pixel text-[11px] leading-none sm:text-sm">
        {label}
      </span>
      <span className="text-sm leading-none sm:text-base">{suit}</span>
    </div>
  );
}

// One source of truth for card dimensions — also used by the empty "?" slot in
// the game board so everything lines up. Sized up for desktop readability.
const CARD_BOX = "relative rounded-2xl w-24 h-36 sm:w-32 sm:h-48";

/**
 * A playing card. Renders the face-up card by default, or a patterned back when
 * `faceDown` is set. Deliberately a plain element (no 3D flip / backface
 * tricks) so the content is always painted and visible — no dependency on a JS
 * animation completing.
 */
export function PlayingCard({
  card,
  faceDown = false,
  highlight,
}: {
  card?: Card;
  faceDown?: boolean;
  /** Optional glow color when the card resolves a win/loss. */
  highlight?: string;
}) {
  if (faceDown || !card) {
    return (
      <div
        className={`${CARD_BOX} border-2 border-purple/40 p-2`}
        style={{
          background:
            "repeating-linear-gradient(45deg, #1a1633, #1a1633 6px, #2c2752 6px, #2c2752 12px)",
          boxShadow: "0 10px 24px -10px rgba(0,0,0,0.7)",
        }}
      >
        <div className="flex h-full items-center justify-center rounded-xl border border-purple/30">
          <span className="font-pixel text-xs text-purple/80">PJ</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${CARD_BOX} bg-gradient-to-br from-white to-[#eceaf2] ring-1 ring-black/10`}
      style={{
        boxShadow: highlight
          ? `0 0 28px 3px ${highlight}, 0 10px 24px -10px rgba(0,0,0,0.7)`
          : "0 10px 24px -10px rgba(0,0,0,0.7)",
      }}
    >
      <CardFace rank={card.rank} suit={card.suit} />
    </div>
  );
}
