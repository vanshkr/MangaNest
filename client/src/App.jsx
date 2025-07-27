import { Layout } from "./layouts/layout";
import {
  Home,
  TopAiring,
  MostPopular,
  RecentlyCompleted,
  LatestReleases,
  HiddenGems,
  MangaDetail,
  MangaView,
  MangaBrowse,
} from "./pages";
import { Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="manga/:id" element={<MangaDetail />} />
          <Route path="top-airing" element={<TopAiring />} />
          <Route path="most-popular" element={<MostPopular />} />
          <Route path="recently-completed" element={<RecentlyCompleted />} />
          <Route path="hidden-gems" element={<HiddenGems />} />
          <Route path="latest-release" element={<LatestReleases />} />
          <Route path="browse" element={<MangaBrowse />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
