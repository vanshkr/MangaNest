export const getAuthorName = async (relationships) => {
  const author = relationships.filter(
    (relationship) => relationship.type === "author"
  );
  const res = await fetch(
    `https://api.mangadex.org/author?ids[]=${author[0].id}`
  );
  const json = await res.json();
  return json.data[0].attributes.name;
};
