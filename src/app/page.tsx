import { GAME_META } from "@/games/registry";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { StudioGallery } from "@/components/StudioGallery";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  const playable = GAME_META.filter((m) => !m.comingSoon);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero count={playable.length} />
        <StudioGallery games={GAME_META} />
      </main>
      <SiteFooter />
    </>
  );
}
