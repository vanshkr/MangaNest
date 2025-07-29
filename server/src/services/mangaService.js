import { getUtcDateString } from "../utils/date.js";
import { getImageUrl } from "../utils/imageURL.js";

export const getTrendingManga = async (limit, monthsAgo) => {
  try {
    const sinceDate = getUtcDateString(monthsAgo);

    const url =
      `${process.env.MANGA_API_URL}/manga?limit=${limit}` +
      `&createdAtSince=${sinceDate}&order[rating]=desc` +
      `&order[updatedAt]=desc` +
      `&order[year]=desc` +
      `&includes[]=cover_art` +
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
  } catch (error) {
    console.error("Failed to get trending manga:", error);
    return []; // Return empty array or consider rethrowing depending on your app design
  }
};

export const getMangaRating = async (mangaIds) => {
  try {
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
  } catch (error) {
    console.error("Failed to get manga ratings:", error);
    return {}; // Return empty ratings to avoid breaking dependent code
  }
};

export const getTopAiringManga = async (
  limit,
  offset = 0,
  mode = "collection"
) => {
  console.log(limit, offset, mode);
  try {
    const url =
      `${process.env.MANGA_API_URL}/manga?limit=${limit}&offset=${offset}` +
      `&order[followedCount]=desc&order[rating]=desc&status[]=ongoing&availableTranslatedLanguage[]=en&order[year]=desc&includes[]=cover_art` +
      `&contentRating[]=safe`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

    const json = await res.json();
    const mangas = {};
    if (mode == "collection") {
      mangas.data = json.data.map((manga) => {
        return {
          id: manga.id,
          title:
            manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
            "Unknown Title",
          year: manga.attributes.year || "N/A",
          imageUrl: getImageUrl(manga.relationships, manga.id, 256),
        };
      });
      return mangas;
    } else if (mode == "full") {
      mangas.data = json.data.map((manga) => {
        return {
          id: manga.id,
          title:
            manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
            "Unknown Title",
          desc: manga.attributes.description?.en,
          imageUrl: getImageUrl(manga.relationships, manga.id, 256),
        };
      });
      mangas["total"] = json.total;
      return mangas;
    } else {
      throw new Error(
        `Backend 400: Invalid mode parameter - wrong mode found.`
      );
    }
  } catch (error) {
    console.error("Failed to get top airing manga:", error);
    return mangas;
  }
};

export const getPopularManga = async (
  limit,
  offset = 0,
  mode = "collection"
) => {
  try {
    const url =
      `${process.env.MANGA_API_URL}/manga?limit=${limit}&offset=${offset}` +
      `&order[followedCount]=desc&order[rating]=desc&availableTranslatedLanguage[]=en&includes[]=cover_art` +
      `&contentRating[]=suggestive`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

    const json = await res.json();
    const mangas = {};
    if (mode === "collection") {
      mangas.data = json.data.map((manga) => {
        return {
          id: manga.id,
          title:
            manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
            "Unknown Title",
          year: manga.attributes.year || "N/A",
          imageUrl: getImageUrl(manga.relationships, manga.id, 256),
        };
      });
      return mangas;
    } else if (mode === "full") {
      mangas.data = json.data.map((manga) => {
        return {
          id: manga.id,
          title:
            manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
            "Unknown Title",
          desc: manga.attributes.description?.en,
          imageUrl: getImageUrl(manga.relationships, manga.id, 256),
        };
      });
      mangas["total"] = json.total;
      return mangas;
    } else {
      throw new Error(
        `Backend 400: Invalid mode parameter - wrong mode found.`
      );
    }
  } catch (error) {
    console.error("Failed to get popular manga:", error);
    return mangas;
  }
};

export const getHiddenGemsManga = async (
  limit,
  offset = 0,
  mode = "collection"
) => {
  try {
    const url =
      `${process.env.MANGA_API_URL}/manga?limit=${limit}` +
      `&order[followedCount]=asc&order[rating]=desc&availableTranslatedLanguage[]=en` +
      `&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

    const json = await res.json();
    const mangas = {};

    if (mode === "collection") {
      mangas.data = json.data.map((manga) => {
        return {
          id: manga.id,
          title:
            manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
            "Unknown Title",
          year: manga.attributes.year || "N/A",
          imageUrl: getImageUrl(manga.relationships, manga.id, 256),
        };
      });
      return mangas;
    } else if (mode === "full") {
      mangas.data = json.data.map((manga) => {
        return {
          id: manga.id,
          title:
            manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
            "Unknown Title",
          desc: manga.attributes.description?.en,
          imageUrl: getImageUrl(manga.relationships, manga.id, 256),
        };
      });
      mangas["total"] = json.total;
      return mangas;
    } else {
      throw new Error(
        `Backend 400: Invalid mode parameter - wrong mode found.`
      );
    }
  } catch (error) {
    console.error("Failed to get recently completed manga:", error);
    return mangas;
  }
};

export const getRecentlyCompletedManga = async (
  limit,
  offset = 0,
  mode = "collection"
) => {
  try {
    const url =
      `${process.env.MANGA_API_URL}/manga?limit=${limit}&offset=${offset}` +
      `&order[followedCount]=desc&order[rating]=desc&status[]=completed&availableTranslatedLanguage[]=en&includes[]=cover_art` +
      `&contentRating[]=safe`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

    const json = await res.json();
    const mangas = {};

    if (mode === "collection") {
      mangas.data = json.data.map((manga) => {
        return {
          id: manga.id,
          title:
            manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
            "Unknown Title",
          year: manga.attributes.year || "N/A",
          imageUrl: getImageUrl(manga.relationships, manga.id, 256),
        };
      });
      return mangas;
    } else if (mode === "full") {
      mangas.data = json.data.map((manga) => {
        return {
          id: manga.id,
          title:
            manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
            "Unknown Title",
          desc: manga.attributes.description?.en,
          imageUrl: getImageUrl(manga.relationships, manga.id, 256),
        };
      });
      mangas["total"] = json.total;
      return mangas;
    } else {
      throw new Error(
        `Backend 400: Invalid mode parameter - wrong mode found.`
      );
    }
  } catch (error) {
    console.error("Failed to get recently completed manga:", error);
    return mangas;
  }
};

export const getLatestReleases = async (limit, offset = 0) => {
  try {
    const url =
      `${process.env.MANGA_API_URL}/manga?limit=${limit}&offset=${offset}` +
      `&status[]=ongoing&availableTranslatedLanguage[]=en&includes[]=cover_art` +
      `&order[year]=desc&order[updatedAt]=desc` +
      `&contentRating[]=safe&contentRating[]=suggestive`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`MangaDex ${res.status}: ${await res.text()}`);

    const json = await res.json();
    const mangas = {};
    mangas.data = json.data.map((manga) => {
      return {
        id: manga.id,
        title:
          manga.attributes.altTitles?.find((title) => "en" in title)?.en ||
          "Unknown Title",
        desc: manga.attributes.description?.en,
        imageUrl: getImageUrl(manga.relationships, manga.id, 256),
      };
    });
    mangas.total = json.total;
    return mangas;
  } catch (error) {
    console.error("Failed to get latest releases manga:", error);
    return mangas;
  }
};
