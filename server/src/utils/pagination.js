export const getPaginationParams = ({
  limit,
  page,
  defaultLimit = 20,
  minLimit = 1,
  maxLimit = 40,
  defaultPage = 1,
  minPage = 1,
}) => {
  const requestedLimit = Number(limit);
  const requestedPage = Number(page);

  const normalizedLimit =
    isNaN(requestedLimit) || requestedLimit === -1
      ? defaultLimit
      : Math.min(Math.max(requestedLimit, minLimit), maxLimit);

  const normalizedPage =
    isNaN(requestedPage) || requestedPage < minPage
      ? defaultPage
      : Math.max(requestedPage, minPage);

  return {
    limit: normalizedLimit,
    page: normalizedPage,
  };
};
