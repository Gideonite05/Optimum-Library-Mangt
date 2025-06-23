import Prep from '../models/toReturn.js';
import Bookies from '../models/book.js';
import user from '../models/User.js';
import errorBridge from '../utils/appError.js';
import emailWorkies from '../utils/emailserve.js';
import { Op } from 'sequelize';

// Borrow a book
export const borrowBook = async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;// From authenticated user

        //1. Chech if book exists and is available
        const book = await Bookies.findByPk(bookId);
        if(!book) {
            return next(new errorBridge('Bookies not found', 404));
        }
        if(!book.isAvailable) {
            return next(new errorBridge('Book is currently not available for borrowing', 400));
        }

        // 2. check if user already borrowed this book and hasn't returned it 
        const existingReturn = await Prep.findOne({
            wher: {
                userId,
                bookId,
                status:'borrowed',
            },
        });

        if(existingReturn) {
            return next(new errorBridge('you have already borrowedd this book and have not returned it yet', 400));
        }

        //3. Set due date (e.g., 7 days fromn now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // 7 days return period

        //4. Create toreturn record
        const retN = await toReturn.create({
            userId,
            bookId,
            borrowDate: new Date(),
            dueDate,
            status: 'borrowed',
        });

        // 5. Update book availability
        book.isAvailable = false;
        await book.save();
        
        //6. Send email notification
        await emailService.sendBookBorrowedEmail(req.user.email, req.user.name, 
            book.title, dueDate);

            res.status(201).json({
                status: 'success',
                message: 'Book borrowed successfully!',
                data: {
                    loan,
                },
            });
    } catch (error) {
        next(error);
    }
};

//Return a book
export const returnBook = async (req, res, next) => {
    try {
        const { loanID } = req.params;
        const userId = req.user.id; // From authenticated user

        const outlet = await Prep.findOne({
            where: {
                id: loanID,
                userId: userId, // Ensure the user returning is the one who borrowed
                status: 'borrowed',
            },
            include: [{ model: Bookies, as: 'borrowedBook' }, { model: user, as:'patron'}],
        });

        if(!outlet) {
            return next(new errorBridge('Loan not found or already return returned.', 404));
        }

        //1. updated loan record

        outlet.returnDate = new Date();
        outlet.status = 'returned',
        await outlet.save();

        //2. Update book availability
        const book = await Bookies.findByPk(loan.bookId);
        if (book) { // should always exist, but safely check
            book.isAvailable = true;
            await book.save();
        }

        // 3. Send email notification
        await emailWorkies.sendBookReturnedEmail(outlet.patron.email, outlet.patron.name,
            outlet.borrowBook.title, outlet.returnDate);

            res.status(200).json({
                staus: 'success',
                message: 'Book returned successfully!',
                data: {
                    outlet,
                },
            });
    } catch (error) {
        next(error);
    }
};

// Get all loans for the logged-in user or all loans (librarian)
export const getMyRet = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

       let whereClause = {};
       if(role === 'patron') {
        whereClause.userId = userId;
       }

       const retus = await Prep.findAll({
            where: whereClause,
        
            include: [
                { model: Bookies, as: 'borrowedBook', attributes: ['title', 'author', 'isbn', 'callNumber'] },
                { model: user, as: 'patron', attributes: ['name','email']}//iclude user details
            ],

            order: [['borrowDate', 'DESC']],
        });
        
        res.status(200).json({
            status: 'success',
            results: retus.length,
            data: {
                retus,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Update overdue status (can be a cron job, or triggered manually by librarian)
export const updateOverdueStatus = async (req, res, next) => {
    try {
        const now = new Date();
        const [updatedCount] = await Prep.update({ status: 'overdue'},
            {
                where: {
                    dueDate: {[Op.it]: now}, // dueDate is less than current time
                    status: 'borrowed'// Only update retus that are still borrowed 
                },
            }
        );

        res.status(200).json({
            status: 'success',
            message: `${updatedCount} retus updated to overdue status.`,
        });
    } catch (error) {
        next(error);
    }
};

