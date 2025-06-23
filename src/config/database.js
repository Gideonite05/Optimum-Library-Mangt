import sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,

    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false, // Set to true to see SQL queries in console
        define: {
            timestamps: true, // Adds createdAt and updatedAt columns by default
        },
        pool: {
            max:5,
            min:0,
            acquire: 30000,
            idle: 10000

        }
    }
);


async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);// Exit process if DB connection fails
    }
}

export { sequelize, connectDB};