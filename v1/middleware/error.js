const errorHandler = (err, req, res, next) => {
  const error = { ...err };

  error.message = err.message;

  // if (error.name === "CastError") {
  //   error.message = "Энэ ID буруу бүтэцтэй ID байна!";
  //   error.statusCode = 400;
  // }

  if (err.message == "invalid signature") {
    res.status(err.statusCode || 500).json({
      success: false,
      message: "Алдаа гарлаа",
    });
  }

  if (error.name === "JsonWebTokenError" && error.message === "invalid token") {
    error.message = "Буруу токен дамжуулсан байна!";
    error.statusCode = 400;
  }

  if (error.code === 11000) {
    error.message = "Энэ талбарын утгыг давхардуулж өгч болохгүй!";
    error.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
    },
  });
};

module.exports = errorHandler;
