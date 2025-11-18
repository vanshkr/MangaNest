import { MangaContentGrid } from "./MangaContentGrid";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useLatestReleasesManga } from "@/hooks/useMangaQueries";

export function RecentReleases() {
  const { data, isLoading, error } = useLatestReleasesManga(25, 1);
  const navigate = useNavigate();
  const mangaList = data?.data || [];

  if (error) {
    return (
      <section>
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400 text-lg">{error.message}</div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center justify-center py-12">
          <div className="text-white text-lg">Loading...</div>
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
