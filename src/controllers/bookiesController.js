import Bookies from "../models/book.js";
import errorBridge from "../utils/appError.js";
import Op, { where } from "sequelize";

// create a new book (Librarian only)
export const createBook = async (req, res, next) => {
    try {
        const newBook = await Bookies.create(req.body);
        res.status(201).json({
            status:'success',
            data: {
                book: newBook,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Get all books with filtering and sorting
export const getAllBooks = async (req, res, next) => {
    try {
        const { search, author, year, edition, isbn, availability } = req.query;
        const whereClause = {};

        // Search by tittle or author
        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${search}%`}},
                {author: { [Op.like]: `%${search}%` }},
            ];
        }

        if(author) whereClause.author = { [Op.like]: `%${author}%`};
        if(year) whereClause.yearPublished = parseInt(year);
        if(edition) whereClause.edition = { [Op.like]: `%${edition}%`};
        if(isbn) whereClause.isbn = isbn;
        if(availability !== undefined) {
            whereClause.isAvailable = availability === 'true'; // convert string to boolean
        }
        const books = await Bookies.findAll({
            where: whereClause,
            order: [['title', 'ASC']], // Default sort by title
        });

        res.status(200).json({
            status: 'success',
            results: books.length,
            data: {
                books,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Get book by ID
export const getBookById = async (req, res, next) => {
    try {
        const book = await Bookies.findByPk(req.params.id);

        if(!book) {
            return next(new errorBridge('No book found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                book,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Update a book (Librarian only)

export const updateBook = async(req, res, next) => {
    try {
        const [updated] = await Bookies.update(req.body, {
            where: { id: req.params.id },
            returning: true, // For PostgreSQL, but useful fro consistency
        });

        if (updated === 0) {
            return next(new errorBridge('No book found with that ID or no changes made', 404));
        }

        const updatedBook = await Bookies.findByPK(req.params.id); // Fetch updated book for MySQL
        res.status(200).json({
            status:'success',
            data: {
                book: updatedBook,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBook = async (req, res, next) => {
    try {
        const deleted = await Bookies.destroy({
            where: { id: req.params.id },
        });

        if (deleted === 0) {
            return next(new errorBridge('No book found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};



