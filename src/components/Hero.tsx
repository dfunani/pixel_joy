export function Hero({ count }: { count: number }) {
  return (
    <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
      <div className="pj-rise font-pixel mb-6 rounded-full border border-pjborder bg-surface/60 px-4 py-2 text-[9px] text-muted backdrop-blur">
        ◆ INSERT COIN · {count} GAME{count === 1 ? "" : "S"} READY
      </div>

      <h1
        className="pj-rise font-pixel text-3xl leading-[1.4] sm:text-5xl sm:leading-[1.4]"
        style={{ animationDelay: "0.05s" }}
      >
        <span className="bg-gradient-to-r from-pink via-purple to-cyan bg-clip-text text-transparent">
          PIXEL
        </span>
        <span className="text-cyan neon">JOY</span>
      </h1>

      <p
        className="pj-rise mt-6 max-w-xl text-base text-muted sm:text-lg"
        style={{ animationDelay: "0.15s" }}
      >
        One studio. Every classic worth replaying. Beautifully rebuilt common
        and retro games — pick one, press start, find your joy.
      </p>

      <a
        href="#games"
        className="pj-rise font-pixel mt-10 rounded-xl bg-gradient-to-r from-pink to-purple px-6 py-4 text-[11px] text-white shadow-lg shadow-purple/30 transition-transform hover:scale-105 active:scale-95"
        style={{ animationDelay: "0.25s" }}
      >
        ▶ ENTER THE ARCADE
      </a>
    </section>
  );
}
