import {
  HeroSection,
  TrendingCarousel,
  MangaSection,
  RecentEpisodes,
} from "@/components";
export const Home = () => {
  return (
    <main>
      <HeroSection />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <TrendingCarousel />
        <section>
          <MangaSection />
        </section>
        <section>
          <RecentEpisodes />
        </section>
      </div>
    </main>
  );
};
