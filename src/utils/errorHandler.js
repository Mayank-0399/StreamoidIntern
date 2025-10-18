// src/utils/errorHandler.js

/**
 * Global Express error handling middleware.
 * This function catches errors thrown in async route handlers or middleware.
 * @param {Error} err - The error object passed by Express.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
function errorHandler(err, req, res, next) {
    // Log the error for debugging purposes (server-side)
    console.error(`[ERROR] ${new Date().toISOString()}: ${err.stack || err.message}`);

    // Determine the status code
    // Use the error's status property if it exists (e.g., from an http-errors package, though not used here)
    // Otherwise, default to 500 Internal Server Error
    const statusCode = err.status || 500; 

    // Send a standardized error response to the client
    res.status(statusCode).json({
        error: {
            message: statusCode === 500 ? 'Internal Server Error' : err.message,
            code: statusCode,
        }
    });
}

module.exports = errorHandler;