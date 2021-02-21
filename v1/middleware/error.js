const errorHandler = (err, req, res, next) => {
  const error = { ...err };

  error.message = err.message;

  console.log(err.message);

  if (err.message == "invalid signature") {
    res.status(err.statusCode || 500).json({
      success: false,
      message: "Алдаа гарлаа",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
    },
  });
};

module.exports = errorHandler;
