import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { TrendingCarousel } from "./components/TrendingCarousel";
import { RecentEpisodes } from "./components/RecentEpisodes";
import { AnimeGrid } from "./components/AnimeGrid";
import { Footer } from "./components/Footer";
function App() {
  return (
    <>
      <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <main>
          <HeroSection />
          <div className="container mx-auto px-4 py-8 space-y-12">
            <TrendingCarousel />
            <section>
              <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
