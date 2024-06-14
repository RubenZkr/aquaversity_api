function errorHandler(err, req, res, next) {
    // Log the error internally
    console.error(err);

    // Determine the status code based on the error type
    const statusCode = err.statusCode || 500;

    // Respond with the error message and status code
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: err.message || 'An unknown error has occurred',
    });
}

module.exports = errorHandler;
