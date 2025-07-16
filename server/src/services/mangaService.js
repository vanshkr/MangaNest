import { getUtcDateString } from "../utils/date.js";
import { getImageUrl } from "../utils/imageURL.js";

export const getTrendingManga = async (limit, monthsAgo) => {
  const sinceDate = getUtcDateString(monthsAgo);

  const url =
    `${process.env.MANGA_API_URL}/manga?limit=${limit}` +
    `&createdAtSince=${sinceDate}` +
    `&order[followedCount]=desc` +
    `&includes[]=cover_art` +
    `&contentRating[]=safe`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

  const json = await res.json();
  const result = json.data.map((manga) => {
    return {
      id: manga.id,
      title: manga.attributes.title.en,
      altTitle: Object.values(manga.attributes.altTitles[0])[0],
      rating: undefined, // Placeholder for rating, to be fetched separately
      imageUrl: getImageUrl(manga.relationships, manga.id, 256),
    };
  });
  const mangaIds = result.map((manga) => manga.id);
  const mangaRatings = await getMangaRating(mangaIds);
  return result.map((manga) => ({
    ...manga,
    rating: mangaRatings[manga.id]?.rating,
  }));
};

export const getMangaRating = async (mangaIds) => {
  let mangas = mangaIds.join("&manga[]=");
  mangas = `manga[]=${mangas}`;
  const url = `${process.env.MANGA_API_URL}/statistics/manga?${mangas}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

  const json = await res.json();
  const result = {};
  for (const [key, value] of Object.entries(json.statistics)) {
    const rating = parseFloat(value.rating.bayesian.toFixed(1));
    const followedCount = value.follows;
    result[key] = {
      rating,
      followedCount,
    };
  }
  return result;
};
