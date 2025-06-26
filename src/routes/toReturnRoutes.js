import Router from 'express';
import {
    borrowBook,
    returnBook,
    getMyRet,
    updateOverdueStatus
} from '../controllers/toReturnController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const toReturnRouter = Router();

toReturnRouter.use(protect); //All return routes require authentication
toReturnRouter.post('/borrow', borrowBook); //user borrows a book
toReturnRouter.patch('/retun/:loanId', returnBook ); // user returns a book
toReturnRouter.get('/my-ret', getMyRet); // Get reus for logged-in user (or all of librarian)

// This route could be hit by a cron job or manually by librarian
toReturnRouter.patch('/update-overdue', restrictTo('librarian'), updateOverdueStatus);

export default toReturnRouter;