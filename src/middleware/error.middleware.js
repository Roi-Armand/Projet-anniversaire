// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Prisma error handling
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      message: 'Database error',
      error: err.message
    });
  }

  // JWT error handling
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
      error: err.message
    });
  }

  // Default error handling
  res.status(err.statusCode || 500).json({
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

