import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, sequelize } from './config/database.js'; // Import sequelizeas well
import user from './models/User.js'; // Import all models to ensure they are
//loaded and synced
import Bookies from './models/book.js';
import Prep from './models/toReturn.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routes/authRoutes.js';
import bookRouter from './routes/bookRoutes.js';
import toReturnRouter from './routes/toReturnRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;
const NODE_ENV = process.env.NODE_ENV || 'development';

//Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded requests
app.use(cors()); // Enable CORS for origins (for development)

//Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Library Management API is running!'});
});

//API Routes
app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/retus', toReturnRouter);

// Global Error Handling Middleware (must be last middleware)
app.use(errorHandler);

// Start Server and Connect to DB
async function startServer() {
    try {
    
            console.log(`name: ${process.env.DB_NAME} user: ${process.env.DB_USER} password: ${process.env.DB_PASSWORD}`);

       await connectDB(); // Connect to the database
       
       //Sync all models (create tables).

       app.listen(PORT,() => {
        console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
        console.log(`Access API at: http://localhost:${PORT}`);
       });
    } catch (error) {
        console.error('Failed to start server.', error);
        process.exit(1); // Exit process with failure
    }
}

startServer();





