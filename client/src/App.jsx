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
  Favorites,
  Login,
  Register,
  RoomCreate,
} from "./pages";
import { Routes, Route } from "react-router-dom";
import { ScrollToTop, ProtectedRoute } from "./components";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        {/* Auth routes - outside of Layout for full-page design */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main app routes - inside Layout */}
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
          <Route path="favorites" element={<Favorites />} />
          <Route
            path="rooms/create"
            element={
              <ProtectedRoute>
                <RoomCreate />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
