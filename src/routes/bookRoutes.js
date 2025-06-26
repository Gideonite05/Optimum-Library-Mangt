import Router from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/authMiddleware.js';

import { 
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
} from '../controllers/bookiesController.js';

const bookRouter = Router();

// Publicly accessible for viewing books
bookRouter.use(protect); // All routes below this line require authentication
bookRouter.use(restrictTo('librarian')); // All routes below this require 'librarian' role

bookRouter.post('/', createBook);
bookRouter.patch('/:id', updateBook); // Using PATCH for partial updates
bookRouter.delete('/:id', deleteBook);


export default bookRouter;
