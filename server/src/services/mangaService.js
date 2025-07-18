import { getUtcDateString } from "../utils/date.js";
import { getImageUrl } from "../utils/imageURL.js";

export const getTrendingManga = async (limit, monthsAgo) => {
  const sinceDate = getUtcDateString(monthsAgo);

  const url =
    `${process.env.MANGA_API_URL}/manga?limit=${limit}` +
    `&createdAtSince=${sinceDate}` +
    `&order[updatedAt]=desc` +
    `&order[year]=desc` +
    `&includes[]=cover_art` +
    `&includes[]=manga` +
    `&contentRating[]=safe`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

  const json = await res.json();
  const result = json.data.map((manga) => {
    return {
      id: manga.id,
      title:
        manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
        "Unknown Title",
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

export const getTopAiringManga = async (limit) => {
  const url =
    `${process.env.MANGA_API_URL}/manga?limit=${limit}` +
    `&order[followedCount]=desc&status[]=ongoing&availableTranslatedLanguage[]=en&order[year]=desc&includes[]=cover_art` +
    `&includes[]=manga&contentRating[]=safe`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

  const json = await res.json();
  return json.data.map((manga) => {
    return {
      id: manga.id,
      title:
        manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
        "Unknown Title",
      year: manga.attributes.year || "N/A",
      imageUrl: getImageUrl(manga.relationships, manga.id, 256),
    };
  });
};

export const getPopularManga = async (limit) => {
  const url =
    `${process.env.MANGA_API_URL}/manga?limit=${limit}` +
    `&order[followedCount]=desc&availableTranslatedLanguage[]=en&includes[]=cover_art` +
    `&includes[]=manga&contentRating[]=suggestive`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

  const json = await res.json();
  return json.data.map((manga) => {
    return {
      id: manga.id,
      title:
        manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
        "Unknown Title",
      year: manga.attributes.year || "N/A",
      imageUrl: getImageUrl(manga.relationships, manga.id, 256),
    };
  });
};

export const getHiddenGemsManga = async (desiredCount = 5) => {
  const fetchManga = async (limit, offset) => {
    const url =
      `${process.env.MANGA_API_URL}/manga?limit=${limit}&offset=${offset}` +
      `&order[followedCount]=asc&availableTranslatedLanguage[]=en` +
      `&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

    const json = await res.json();
    return json.data.map((manga) => ({
      id: manga.id,
      title: manga.attributes.altTitles?.find((title) => "en" in title)?.en,
      year: manga.attributes.year,
      imageUrl: getImageUrl(manga.relationships, manga.id, 256),
    }));
  };

  const hiddenGems = [];
  let offset = 0;
  const pageSize = 30;
  const maxTries = 5; // To avoid infinite loop

  while (hiddenGems.length < desiredCount && maxTries > 0) {
    const batch = await fetchManga(pageSize, offset);
    const ratings = await getMangaRating(batch.map((m) => m.id));

    const filtered = batch.filter(
      (m) =>
        ratings[m.id]?.rating >= 7 &&
        ratings[m.id]?.followedCount <= 5000 &&
        m.title &&
        m.year
    );

    hiddenGems.push(...filtered);
    offset += pageSize;

    if (batch.length < pageSize) break; // no more data
  }

  return hiddenGems.slice(0, desiredCount);
};

export const getRecentlyCompletedManga = async (limit) => {
  const url =
    `${process.env.MANGA_API_URL}/manga?limit=${limit}` +
    `&order[followedCount]=desc&status[]=completed&availableTranslatedLanguage[]=en&&includes[]=cover_art` +
    `&includes[]=manga&contentRating[]=safe`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

  const json = await res.json();
  return json.data.map((manga) => {
    return {
      id: manga.id,
      title:
        manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
        "Unknown Title",
      year: manga.attributes.year || "N/A",
      imageUrl: getImageUrl(manga.relationships, manga.id, 256),
    };
  });
};
