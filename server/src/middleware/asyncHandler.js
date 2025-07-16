export const asyncHandler = (fn) => async (req, res, next) => {
  const label = `[${req.method}] ${req.originalUrl}`;

  if (process.env.NODE_ENV !== "production") console.time(label);

  try {
    await fn(req, res, next);
  } catch (err) {
    return next(err);
  }

  if (process.env.NODE_ENV !== "production") console.timeEnd(label);
};
