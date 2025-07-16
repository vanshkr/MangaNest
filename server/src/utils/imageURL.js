export const getImageUrl = (relationships, mangaId, size = 256) => {
  const coverArt = relationships.filter(
    (relationship) => relationship.type === "cover_art"
  );
  return `https://mangadex.org/covers/${mangaId}/${coverArt[0].attributes.fileName}.${size}.jpg`;
};
