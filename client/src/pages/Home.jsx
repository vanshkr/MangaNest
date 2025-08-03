import { HeroSection, TrendingCarousel, MangaSection } from "@/components";
import { lazy, Suspense } from "react";
const RecentReleases = lazy(() =>
  import("@/components").then((module) => ({ default: module.RecentReleases }))
);
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
          {
            <Suspense fallback={<div>Loading Recent Releases...</div>}>
              <RecentReleases />
            </Suspense>
          }
        </section>
      </div>
    </main>
  );
};
