# Optimum-Library-Mangt
This is application of Knowledge - Future based implementation

This project provides the backend API for an Offline Library Management System, designed to manage a collection of 2000-5000 books, user authentication, and book borrowing/returning functionalities. It emphasizes a modular architecture for scalability and maintainability.
✨ Features
## Book Management:
Store book records with attributes: Author, Book Title, Year of Publication, Call Number (unique), Edition, ISBN (unique).
CRUD (Create, Read, Update, Delete) operations for books (restricted to librarians).
Search and Filter books by title, author, year, edition, ISBN, and availability.
## User Management & Authentication:
User registration and login using email and password.
Support for different user roles (patron, librarian).
JWT-based authentication for secure API access.
## Book Loaning System:
Record book borrowing and returning actions.
Track borrowDate, returnDate, dueDate, and status (borrowed, returned, overdue).
Ability to list loans for a specific user or all loans (for librarians).
Functionality to update overdue statuses (can be integrated with a cron job).
## Email Notifications:
Sends email notifications upon book retrieval (borrowing) and return.
Designed with an "offline" consideration, meaning it can be configured for local SMTP or logging if external internet access is limited.
Robust Error Handling: Centralized middleware for consistent API error responses.
Modular Design: Clear separation of concerns for routes, controllers, models, middleware, and utilities.

💻 Technology Stack
Runtime: Node.js (with ESM - ES Modules)
Web Framework: Express.js
Database: MySQL
ORM (Object-Relational Mapper): Sequelize
Authentication: jsonwebtoken (JWT), bcryptjs (password hashing)
Email Service: nodemailer
Environment Management: dotenv
Utilities: cors, nodemon (for development)

📂 Project Structure
```javascript
library-management-backend/
├── .env                  # Environment variables (private)
├── .env.example          # Template for environment variables
├── .gitignore            # Files/directories to ignore for Git
├── package.json          # Project metadata and dependencies
├── README.md             # Project documentation (this file)
└── src/
    ├── config/
    │   └── database.js   # Database connection and Sequelize setup
    ├── controllers/
    │   ├── authController.js   # Handles user registration and login
    │   ├── bookController.js   # Manages book-related business logic
    │   └── loanController.js   # Manages book borrowing and returning logic
    ├── middleware/
    │   ├── authMiddleware.js   # JWT verification and role-based access control
    │   └── errorHandler.js     # Centralized error handling
    ├── models/
    │   ├── Book.js             # Defines the Book database schema
    │   ├── Loan.js             # Defines the Loan database schema
    │   ├── User.js             # Defines the User database schema
    │   └── index.js            # Defines relationships (associations) between models
    ├── routes/
    │   ├── authRoutes.js       # API routes for authentication
    │   ├── bookRoutes.js       # API routes for books
    │   └── loanRoutes.js       # API routes for loans
    ├── seeders/
    │   └── seed.js             # Script to populate initial database data
    ├── utils/
    │   ├── appError.js         # Custom error class
    │   └── emailService.js     # Email sending utility
    └── server.js               # Main Express application entry point
```

🚀 Getting Started
Follow these steps to set up and run the project locally.
Prerequisites
Node.js (v14 or higher recommended)
MySQL Server (running locally or accessible)
npm (Node Package Manager)
1. Clone the Repository (or create manually)
If you're setting up manually, create the files and directories as per the Project Structure above.
2. Install Dependencies
Navigate to the project root directory and install all required packages:
npm install

3. Environment Configuration
Create a .env file in the project root by copying the example:
cp .env.example .env

Open the newly created .env file and fill in your actual credentials:
## Application Configuration
PORT=3000
NODE_ENV=development # or production

## Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password # <--- IMPORTANT: Replace with your MySQL root password
DB_NAME=library_db             # <--- IMPORTANT: Choose a name for your database

## JWT Configuration
JWT_SECRET=supersecretlibrarykey
JWT_EXPIRES_IN=1h

## Email Configuration (Nodemailer)
## For testing with real emails (e.g., Gmail):
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@example.com      # <--- IMPORTANT: Your Gmail address
EMAIL_PASSWORD=your_email_app_password # <--- IMPORTANT: Use an App Password for Gmail (NOT your regular password)

## For offline/local SMTP testing (uncomment and configure if not using cloud email service):
### EMAIL_SERVICE=smtp
### EMAIL_HOST=your_local_smtp_host
### EMAIL_PORT=25
### EMAIL_SECURE=false
### EMAIL_AUTH_USER=
### EMAIL_AUTH_PASS=

4. Database Setup
Ensure your MySQL server is running. The src/config/database.js file handles the connection.
Initial Table Creation:
For the very first run to create the tables in your database, you might need to temporarily uncomment the await sequelize.sync({ alter: true }); line within the connectDB function in src/config/database.js.
```javascript
// src/config/database.js (inside connectDB function)
// ...
async function connectDB() {
  try {
    // ...
    await sequelize.sync({ alter: true }); // Temporarily uncomment for first run
    console.log('All models were synchronized successfully.');
  } catch (error) {
    // ...
  }
}
// ...
```

After the tables are created successfully, remember to comment this line out again. In a production environment, you would use more robust database migration tools (e.g., Sequelize CLI migrations) for schema changes instead of sync().
5. Seeding Initial Data
To populate your database with sample users (librarian and patrons) and books:
npm run seed

Warning: The seeder (src/seeders/libseed.js) uses sequelize.sync({ force: true }), which will drop all existing tables and recreate them, leading to data loss. Only use this for initial setup or if you want a fresh database.
6. Run the Application
Development Mode (with Nodemon)
npm run dev