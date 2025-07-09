import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { TrendingCarousel } from "./components/TrendingCarousel";
import { RecentEpisodes } from "./components/RecentEpisodes";
import { TopAnime } from "./components/TopAnime";
import { AnimeGrid } from "./components/AnimeGrid";
import { Footer } from "./components/Footer";
function App() {
  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
        <Header />
        <main>
          <HeroSection />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
            <TrendingCarousel />
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <AnimeGrid title="Top Airing" />
                <AnimeGrid title="Most Popular" />
                <AnimeGrid title="Most Favorite" />
                <AnimeGrid title="Latest Completed" />
              </div>
            </section>
            <section>
              <RecentEpisodes />
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
