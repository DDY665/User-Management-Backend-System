const errorHandler = (err, req, res, next) => {
  // If response already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Log error (can be replaced with Winston later)
  console.error(err);

  const statusCode = err.status || 500;
  const message =
    statusCode === 500
      ? "Internal Server Error"
      : err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
