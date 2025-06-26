import user from "../models/User.js";
import Bookies from "../models/book.js";
import Prep from "../models/toReturn.js";
import { connectDB, sequelize } from "../config/database.js";
import { truncates } from "bcryptjs";

async function seedData() {
    await connectDB();// Ensure DB is connected

    try {
        //Sync models (if not already done via app.js or migration)
        // await sequelize.sync({ force: true });// WARNING: This will drop existing tables! Use only for fresh seeding.
        console.log('Tables synchronized(forced recreation).');

        //Create Users
        const librarianUser = await user.create({
            name: 'Admin Librarian',
            email: 'librarian@statlibrary.org',
            password: 'password123', // Will be hashed by model hook
            role: 'librarian'
        });
        console.log('Librarian user created.');

        const patronUser1 = await user.create({
            name:'kelvin Molar',
            email: 'kelvinmolar@statlibrary.org',
            password: 'password1234',
            role: 'patron'
        });
        console.log('Patron user 1 created.');

        const patronUser2 = await user.create({
            name: 'Juliet caroline',
            email: 'julietcaroline@statlibrary.org',
            password: 'password12345',
            role: 'patron'
        });
        console.log('Patron user 2 created.');

        //Create Books
        const books = await Bookies.bulkCreate([
            {
                title: 'Engineering Mathematics',
                author: 'H.K Dass',
                yearPublished: 1993,
                callNumber: 'sci-QA-41',
                edition: 'fourth Edition',
                isbn: '7895442844637',
                isAvailable: true
            },
            {
                title: 'The science of crypto',
                author: 'Fracis Marshal',
                yearPublished: '1945',
                callNumber: 'sci-RA-45',
                edition: 'sixth Edition',
                isbn: '9876567854343',
                isAvailable: true
            },
            {
                title: 'star ball in the Galaxies',
                author: 'K.R. Williams',
                yearPublished: 1962,
                callNumber: 'SPC-RT-02',
                edition: 'second Edition',
                isbn: '2341230983423'
            },
            {
                title: 'Uncovering the Space Tech',
                author: 'W.T Thompson',
                yearPublished: 1985,
                callNumber: 'TEC-RS-25',
                edition: 'Explore edition',
                isbn: '3423678940245',
                isAvailable: true
            },
            {
                title: 'Law and The Judges',
                author: 'S. Wumi Martins',
                yearPublished: 2005,
                callNumber: 'Law-WJ-76',
                edition: 'Polished Edition',
                isbn: '7894032123464',
                isAvailable: true
            }

        ]);
        console.log('Books seeded successfully!');

        // Create an initial loan (Optional)
        const bookToBorrow = books[0]; // The Great Gatsby
        const borrowedBook = await Prep.create({
            userId: patronUser1.id,
            bookID: bookToBorrow.id,
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 12*24*60*60*1000), // 14 days from now
            status: 'borrowed'
        });
        // Mark the book as unavailable
        bookToBorrow.isAvailable = false;
        await bookToBorrow.save();
        console.log(`'${bookToBorrow.title}' borrowed by ${patronUser1.name}.`);
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await sequelize.close(); // Close connection after seeding
        console.log('Database connection closed after seeding');
    }
}

seedData();

