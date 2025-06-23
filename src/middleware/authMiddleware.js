import promisify from 'util';
import jwt from 'jsonwebtoken';
import { user } from '../models/User.js';
import { errorBridge } from '../utils/appError.js';

export const protect = async (req, res, next) => {
    // 1) Get token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split('')[1];
    } 

    if (!token) {
        return next(new errorBridge('You are not logged in! Please login to get access.', 401));
    }

    try {
        //2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await user.findByPk(decoded.id);
        if (!currentUser) {
          return next(new errorBridge('The user belonging to this token no longer exists.', 401));   
        }

        // 4) Grant access to protected route
        req.user = currentUser; // Attach user to request object
        next();
    }catch (err) {
        next(err);// Pass JWT errors to global error handler
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles might be [admin or librarian]

    if (!roles.includes(req.user.role)) {
        return next(new errorBridge('You do not have permission to perform this action', 403));
    }
    next();
    };
};