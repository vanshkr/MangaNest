import { Layout } from "./layouts/layout";
import {
  Home,
  TopAiring,
  MostPopular,
  RecentlyCompleted,
  LatestReleases,
  HiddenGems,
  MangaDetail,
  MangaBrowse,
  MangaView,
  SearchResults,
  NotFound,
} from "./pages";
import { Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="manga/:mangaId" element={<MangaDetail />} />
          <Route path="manga/:mangaId/read/:chapterId" element={<MangaView />} />
          <Route path="top-airing" element={<TopAiring />} />
          <Route path="most-popular" element={<MostPopular />} />
          <Route path="recently-completed" element={<RecentlyCompleted />} />
          <Route path="hidden-gems" element={<HiddenGems />} />
          <Route path="latest-release" element={<LatestReleases />} />
          <Route path="browse" element={<MangaBrowse />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
