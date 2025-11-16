import { MangaContentGrid } from "./MangaContentGrid";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_ENDPOINTS, fetchWithErrorHandling } from "@/config/api";

export function RecentReleases() {
  const [mangaList, setMangaList] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestReleases = async () => {
      try {
        const data = await fetchWithErrorHandling(
          `${API_ENDPOINTS.latestReleases}?limit=25`
        );
        setMangaList(data.data);
      } catch (err) {
        console.error("Failed to fetch latest releases:", err);
        setError("Failed to load latest releases");
      }
    };
    fetchLatestReleases();
  }, []);
  if (error) {
    return (
      <section>
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400 text-lg">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Latest Release</h2>
        <Button
          variant="ghost"
          className="text-purple-400 hover:text-purple-500 cursor-pointer"
          onClick={() => navigate("/latest-release")}
        >
          View All
        </Button>
      </div>
      <MangaContentGrid mangaList={mangaList} />
    </section>
  );
}
