import Link from "next/link";

/** The PixelJoy wordmark — pixel font with a neon gradient. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-pixel inline-flex items-center gap-2 select-none ${className}`}
    >
      <span className="text-pink neon">▮</span>
      <span className="bg-gradient-to-r from-pink via-purple to-cyan bg-clip-text text-transparent">
        PIXEL
      </span>
      <span className="text-cyan neon">JOY</span>
    </Link>
  );
}
