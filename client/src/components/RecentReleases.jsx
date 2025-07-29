import { MangaContentGrid } from "./MangaContentGrid";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
export function RecentReleases() {
  const [mangaList, setMangaList] = useState([]);
  useEffect(() => {
    const fetchTopAiring = async () => {
      const response = await fetch(
        `http://localhost:3000/api/manga/latest-releases?limit=${25}`
      );
      const data = await response.json();
      setMangaList(data.data);
    };
    fetchTopAiring();
  }, []);
  const navigate = useNavigate();
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
