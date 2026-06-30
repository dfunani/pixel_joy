"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PlayingCard } from "./PlayingCard";
import {
  Card,
  STARTING_BANKROLL,
  freshDeck,
  isDeadHand,
  isWinningCard,
  shuffle,
  sortPair,
} from "./logic";

type Phase = "betting" | "revealed" | "gameover";

interface RoundResult {
  outcome: "win" | "lose" | "pass";
  delta: number;
}

const QUICK_BETS = [10, 25, 50] as const;

// A fixed, non-dead placeholder hand rendered (face-up) on the very first
// paint. It is deterministic — no Math.random during render — so the server's
// HTML matches the client's first render (no hydration mismatch). The real
// shuffled hand is dealt on mount, below.
const PLACEHOLDER: [Card, Card] = [
  { rank: 3, suit: "♣" },
  { rank: 11, suit: "♦" },
];

export default function AceyDuceyGame() {
  const [deck, setDeck] = useState<Card[]>(() => freshDeck());
  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [peak, setPeak] = useState(STARTING_BANKROLL);
  const [dealer, setDealer] = useState<[Card, Card]>(PLACEHOLDER);
  const [third, setThird] = useState<Card | null>(null);
  const [bet, setBet] = useState(10);
  const [phase, setPhase] = useState<Phase>("betting");
  const [result, setResult] = useState<RoundResult | null>(null);
  const [hands, setHands] = useState(0);

  // NOTE: each handler computes its next state from values in scope and calls
  // every setter exactly once with a concrete value. We deliberately avoid
  // nesting setState calls inside another updater — React StrictMode invokes
  // updater functions twice, which would double-apply any side effects (e.g.
  // debiting the bankroll twice for a single bet).

  /** Shuffle a fresh deck and deal the opening hand (client only). */
  const startHand = useCallback(() => {
    const shuffled = shuffle(freshDeck());
    const a = shuffled.pop()!;
    const b = shuffled.pop()!;
    setDeck(shuffled);
    setDealer(sortPair(a, b));
    setThird(null);
    setResult(null);
    setPhase("betting");
  }, []);

  // Auto-deal once on mount. Effects never run during SSR, so the opening
  // shuffle stays client-side and the board appears as soon as React mounts.
  useEffect(() => {
    startHand();
  }, [startHand]);

  const dealNewHand = useCallback(() => {
    const working = deck.length < 4 ? shuffle(freshDeck()) : deck.slice();
    const a = working.pop()!;
    const b = working.pop()!;
    setDeck(working);
    setDealer(sortPair(a, b));
    setThird(null);
    setResult(null);
    setPhase("betting");
    setBet((b2) => Math.min(b2, bankroll) || Math.min(10, bankroll));
  }, [deck, bankroll]);

  const dead = isDeadHand(dealer[0], dealer[1]);

  const placeBet = useCallback(
    (amount: number) => {
      if (phase !== "betting") return;
      const wager = Math.max(0, Math.min(amount, bankroll));

      const working = deck.length < 1 ? shuffle(freshDeck()) : deck.slice();
      const next = working.pop()!;
      setDeck(working);
      setThird(next);
      setHands((h) => h + 1);

      if (wager === 0) {
        setResult({ outcome: "pass", delta: 0 });
        setPhase("revealed");
        return;
      }

      const win = isWinningCard(dealer[0], dealer[1], next);
      const delta = win ? wager : -wager;
      const nextBankroll = bankroll + delta;
      setBankroll(nextBankroll);
      setPeak((p) => Math.max(p, nextBankroll));
      setResult({ outcome: win ? "win" : "lose", delta });
      setPhase(nextBankroll <= 0 ? "gameover" : "revealed");
    },
    [phase, bankroll, dealer, deck],
  );

  const restart = useCallback(() => {
    const d = shuffle(freshDeck());
    setDeck(d.slice(2));
    setDealer(sortPair(d[0], d[1]));
    setThird(null);
    setResult(null);
    setBankroll(STARTING_BANKROLL);
    setPeak(STARTING_BANKROLL);
    setBet(10);
    setPhase("betting");
    setHands(0);
  }, []);

  const accentHex =
    result?.outcome === "win"
      ? "#3df58a"
      : result?.outcome === "lose"
        ? "#ff2e88"
        : undefined;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Bankroll readout. Peak is tracked but only revealed on game over. */}
      <div className="flex w-full items-center justify-around gap-4">
        <Stat label="BANKROLL" value={`$${bankroll}`} tone="cyan" />
        <Stat label="HANDS" value={String(hands)} tone="muted" />
      </div>

      {/* The felt */}
      <div className="flex w-full flex-col items-center gap-6">
        <p className="font-pixel text-[9px] text-muted">DEALER SHOWS</p>
        <div className="flex items-center gap-4 sm:gap-8">
          <PlayingCard card={dealer[0]} />
          <div className="flex flex-col items-center gap-3">
            <AnimatePresence mode="wait">
              {third ? (
                <motion.div
                  key="third"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <PlayingCard card={third} highlight={accentHex} />
                </motion.div>
              ) : (
                <motion.div
                  key="slot"
                  className="flex w-24 h-36 sm:w-32 sm:h-48 items-center justify-center rounded-2xl border-2 border-dashed border-pjborder"
                >
                  <span className="font-pixel text-xs text-muted/60">?</span>
                </motion.div>
              )}
            </AnimatePresence>
            <span className="font-pixel text-[7px] text-muted/60">
              IN BETWEEN?
            </span>
          </div>
          <PlayingCard card={dealer[1]} />
        </div>

        {dead && phase === "betting" && (
          <p className="font-pixel text-center text-[8px] leading-relaxed text-pink">
            TIGHT SPREAD — TOUGH TO WIN. CONSIDER PASSING.
          </p>
        )}
      </div>

      {/* Result banner */}
      <div className="h-8">
        <AnimatePresence>
          {result && (
            <motion.p
              key={result.outcome + hands}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`font-pixel text-center text-sm ${
                result.outcome === "win"
                  ? "text-green neon"
                  : result.outcome === "lose"
                    ? "text-pink neon"
                    : "text-muted"
              }`}
            >
              {result.outcome === "win" && `WIN +$${result.delta}`}
              {result.outcome === "lose" && `BUST -$${-result.delta}`}
              {result.outcome === "pass" && "PASSED"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {phase === "betting" && (
        <div className="flex w-full max-w-sm flex-col items-center gap-5">
          <div className="flex w-full items-center gap-3">
            <span className="font-pixel text-[8px] text-muted">BET</span>
            <input
              type="range"
              min={0}
              max={bankroll}
              value={Math.min(bet, bankroll)}
              onChange={(e) => setBet(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-2 accent-green"
            />
            <span className="font-pixel w-16 text-right text-sm text-green tabular-nums">
              ${Math.min(bet, bankroll)}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_BETS.map((q) => (
              <button
                key={q}
                disabled={q > bankroll}
                onClick={() => setBet(q)}
                className="font-pixel rounded-lg bg-surface-2 px-3 py-2 text-[9px] text-foreground transition-colors hover:bg-pjborder disabled:opacity-30"
              >
                ${q}
              </button>
            ))}
            <button
              onClick={() => setBet(bankroll)}
              className="font-pixel rounded-lg bg-surface-2 px-3 py-2 text-[9px] text-yellow transition-colors hover:bg-pjborder"
            >
              ALL IN
            </button>
          </div>

          <div className="flex w-full gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => placeBet(0)}
              className="font-pixel flex-1 rounded-xl border border-pjborder px-4 py-4 text-[9px] text-muted transition-colors hover:text-foreground"
            >
              PASS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => placeBet(bet)}
              disabled={Math.min(bet, bankroll) <= 0}
              className="font-pixel flex-[2] rounded-xl bg-gradient-to-r from-green to-cyan px-4 py-4 text-[10px] text-[#07060f] disabled:opacity-40"
            >
              DEAL CARD ▶
            </motion.button>
          </div>
        </div>
      )}

      {phase === "revealed" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={dealNewHand}
          className="font-pixel rounded-xl bg-gradient-to-r from-purple to-pink px-8 py-4 text-[10px] text-white"
        >
          NEXT HAND ▶
        </motion.button>
      )}

      {phase === "gameover" && (
        <div className="flex flex-col items-center gap-4">
          <p className="font-pixel text-center text-base text-pink neon">
            GAME OVER
          </p>
          <p className="text-center text-sm text-muted">
            You lasted {hands} hand{hands === 1 ? "" : "s"} and peaked at ${peak}.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={restart}
            className="font-pixel rounded-xl bg-gradient-to-r from-green to-cyan px-8 py-4 text-[10px] text-[#07060f]"
          >
            ↻ NEW STACK · $100
          </motion.button>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "yellow" | "muted";
}) {
  const color =
    tone === "cyan" ? "text-cyan" : tone === "yellow" ? "text-yellow" : "text-muted";
  return (
    <div className="flex flex-col items-center">
      <span className="font-pixel text-[7px] text-muted/70">{label}</span>
      <span className={`font-pixel mt-1 text-sm tabular-nums ${color}`}>
        {value}
      </span>
    </div>
  );
}
