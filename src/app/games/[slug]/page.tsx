import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GAME_META, getGameMeta } from "@/games/registry";
import { GameShell } from "@/components/GameShell";
import { GameHost } from "@/components/GameHost";

export function generateStaticParams() {
  return GAME_META.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getGameMeta(slug);
  if (!meta) return { title: "Not found — PixelJoy" };
  return {
    title: `${meta.title} — PixelJoy`,
    description: meta.description,
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getGameMeta(slug);
  if (!meta || meta.comingSoon) notFound();

  return (
    <GameShell meta={meta}>
      <GameHost slug={slug} />
    </GameShell>
  );
}
