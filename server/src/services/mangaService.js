import { getUtcDateString } from "../utils/date.js";
import { getImageUrl } from "../utils/imageURL.js";
import { getAuthorName } from "../utils/authorName.js";

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

export const getMangaDetails = async (mangaId, limit = 20, offset = 0) => {
  try {
    const mangaDetailsUrl = `${process.env.MANGA_API_URL}/manga/${mangaId}?&includes[]=cover_art`;
    const mangaStatsUrl = `${process.env.MANGA_API_URL}/statistics/manga/${mangaId}`;
    const mangaChaptersUrl = `${process.env.MANGA_API_URL}/chapter?manga=${mangaId}&limit=${limit}&offset=${offset}&order[chapter]=desc`;

    const [detailsRes, statsRes, chapterRes] = await Promise.all([
      fetch(mangaDetailsUrl),
      fetch(mangaStatsUrl),
      fetch(mangaChaptersUrl),
    ]);
    if (!detailsRes.ok)
      throw new Error(
        `MangaDex ${detailsRes.status}: ${await detailsRes.text()}`
      );
    if (!statsRes.ok)
      throw new Error(`MangaDex ${statsRes.status}: ${await statsRes.text()}`);
    if (!chapterRes.ok)
      throw new Error(
        `MangaDex ${chapterRes.status}: ${await chapterRes.text()}`
      );

    const [detailsJson, statsJson, chapterJson] = await Promise.all([
      detailsRes.json(),
      statsRes.json(),
      chapterRes.json(),
    ]);
    const author = await getAuthorName(detailsJson.data.relationships);
    const details = {
      id: detailsJson.data.id,
      title: detailsJson.data.attributes.title?.en || "Unknown Title",
      altTitle:
        detailsJson.data.attributes.altTitles?.find(
          (altTitle) => "ja" in altTitle
        )?.ja || "Unknown AltTitle",
      coverImageUrl: getImageUrl(
        detailsJson.data.relationships,
        detailsJson.data.id,
        256
      ),
      author: author,
      desc: detailsJson.data.attributes.description.en,
      demographic: detailsJson.data.attributes.publicationDemographic,
      status: detailsJson.data.attributes.status,
      year: detailsJson.data.attributes.year,
      contentRating: detailsJson.data.attributes.contentRating,
      tags: detailsJson.data.attributes.tags.reduce((acc, curr) => {
        let key = curr["attributes"]["group"];
        let value = curr["attributes"]["name"]["en"];

        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(value);

        return acc;
      }, {}),
      rating: parseFloat(
        statsJson?.statistics[mangaId].rating?.bayesian
      ).toFixed(1),
      follows: statsJson?.statistics[mangaId].follows,
      lastUpdated: new Date(detailsJson.data.attributes.updatedAt),
    };
    const seen = new Set();
    const chapters = chapterJson.data.reduce((acc, curr) => {
      const chapter = Number(curr.attributes.chapter);
      if (!seen.has(chapter)) {
        acc.push({
          pages: curr.attributes.pages,
          date: new Date(curr.attributes.readableAt).toLocaleDateString(),
          chapter: chapter,
          chapterId: curr.id,
        });
        seen.add(chapter);
      }
      return acc;
    }, []);
    return {
      details,
      chapters,
    };
  } catch (error) {
    console.error("Failed to get latest releases manga:", error);
    return {};
  }
};
