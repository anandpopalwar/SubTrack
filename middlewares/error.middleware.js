const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error(error.message);

    // Mongoose bad ObjectId
    if (err.name === "CaseError" || err.name === "CastError") {
      const msg = "Resource not found";
      err.message = new Error(msg);
      error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const msg = "Duplicate feild value entered";
      err.message = new Error(msg);
      error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      // err.errors return object of errors
      const msg = Object.values(err.errors).map((val) => val.message);
      err.message = new Error(msg.join(", "));
      error.statusCode = 422;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
