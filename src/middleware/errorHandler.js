import errorBridge from "../utils/appError";

const errorHandler = (err, req, res, next) => {
    console.error('Global Error Handler:', err); // Log the full error

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong!';

    //Handle specific Sequelize errors
    if (err.name === 'sequelizValidationError') {
        statusCode = 400;
        message = err.errors.maps(e => e.message).join(',');
    } else if (err.name === 'sequelizeUniqueConstraintError') {
        statusCode = 409;
        message = `Duplicate entry for field: ${Object.keys(err.fields)[0]}`;
    } else if (err.name === 'sequelizeForeignKeyConstraintError') {
        statusCode = 400;
        message = 'Foreign key constraint failed. Check related entities.';
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message ='Invalid token. Please log in again!';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired! Please log in again.';
    } else if (err instanceof errorBridge) {
        // Custom Operational errors
        statusCode = err.statusCode;
        message = err.message;

        res.status(statusCode).json({
            status: 'error',
            message: message,

            // Only send stack trace in development mode
            ...(process.env.NODE_ENV === 'development' && { error: err.stack })
        });
    };
}

export default errorHandler;