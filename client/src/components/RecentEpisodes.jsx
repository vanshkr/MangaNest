import { MangaContentGrid } from "./MangaContentGrid";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function RecentEpisodes() {
  const mangaList = [
    {
      id: 1,
      title: "Demon Slayer: Kimetsu no Yaiba",
      episode: "Episode 12",
      episodeTitle: "The Final Battle",
      image:
        "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "2 hours ago",
      isNew: true,
      rating: 8.9,
    },
    {
      id: 2,
      title: "Jujutsu Kaisen",
      episode: "Episode 8",
      episodeTitle: "Cursed Technique Reversal",
      image:
        "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "23 min",
      timeAgo: "5 hours ago",
      isNew: true,
      rating: 8.9,
    },
    {
      id: 3,
      title: "One Piece",
      episode: "Episode 1095",
      episodeTitle: "The Revolutionary Army Strikes",
      image:
        "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "1 day ago",
      isNew: false,
      rating: 8.9,
    },
    {
      id: 4,
      title: "My Hero Academia",
      episode: "Episode 25",
      episodeTitle: "Plus Ultra",
      image:
        "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "2 days ago",
      isNew: false,
      rating: 8.9,
    },
    {
      id: 1,
      title: "Demon Slayer: Kimetsu no Yaiba",
      episode: "Episode 12",
      episodeTitle: "The Final Battle",
      image:
        "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "2 hours ago",
      isNew: true,
      rating: 8.9,
    },
    {
      id: 2,
      title: "Jujutsu Kaisen",
      episode: "Episode 8",
      episodeTitle: "Cursed Technique Reversal",
      image:
        "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "23 min",
      timeAgo: "5 hours ago",
      isNew: true,
      rating: 8.9,
    },
    {
      id: 3,
      title: "One Piece",
      episode: "Episode 1095",
      episodeTitle: "The Revolutionary Army Strikes",
      image:
        "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "1 day ago",
      isNew: false,
      rating: 8.9,
    },
    {
      id: 4,
      title: "My Hero Academia",
      episode: "Episode 25",
      episodeTitle: "Plus Ultra",
      image:
        "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "2 days ago",
      isNew: false,
      rating: 8.9,
    },
    {
      id: 1,
      title: "Demon Slayer: Kimetsu no Yaiba",
      episode: "Episode 12",
      episodeTitle: "The Final Battle",
      image:
        "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "2 hours ago",
      isNew: true,
      rating: 8.9,
    },
    {
      id: 2,
      title: "Jujutsu Kaisen",
      episode: "Episode 8",
      episodeTitle: "Cursed Technique Reversal",
      image:
        "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "23 min",
      timeAgo: "5 hours ago",
      isNew: true,
      rating: 8.9,
    },
    {
      id: 3,
      title: "One Piece",
      episode: "Episode 1095",
      episodeTitle: "The Revolutionary Army Strikes",
      image:
        "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "1 day ago",
      isNew: false,
      rating: 8.9,
    },
    {
      id: 4,
      title: "My Hero Academia",
      episode: "Episode 25",
      episodeTitle: "Plus Ultra",
      image:
        "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "2 days ago",
      isNew: false,
      rating: 8.9,
    },
    {
      id: 1,
      title: "Demon Slayer: Kimetsu no Yaiba",
      episode: "Episode 12",
      episodeTitle: "The Final Battle",
      image:
        "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "2 hours ago",
      isNew: true,
      rating: 8.9,
    },
    {
      id: 2,
      title: "Jujutsu Kaisen",
      episode: "Episode 8",
      episodeTitle: "Cursed Technique Reversal",
      image:
        "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "23 min",
      timeAgo: "5 hours ago",
      isNew: true,
      rating: 8.9,
    },
    {
      id: 3,
      title: "One Piece",
      episode: "Episode 1095",
      episodeTitle: "The Revolutionary Army Strikes",
      image:
        "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "1 day ago",
      isNew: false,
      rating: 8.9,
    },
    {
      id: 4,
      title: "My Hero Academia",
      episode: "Episode 25",
      episodeTitle: "Plus Ultra",
      image:
        "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      duration: "24 min",
      timeAgo: "2 days ago",
      isNew: false,
      rating: 8.9,
    },
  ];
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
      <MangaContentGrid
        contentHeading={"Latest Release"}
        mangaList={mangaList}
      />
    </section>
  );
}
