import { user } from "../models/User.js";
import errorBridge from "../utils/appError.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export const register = async (req,res,next) => {
    try {
        const { name, email, password, role } = req.body;

        //Basic validation
        if (!name || !email || !password) {
            return next(new errorBridge('Please provide name, email, and password', 400));
        }
        const newUser = await user.create({
            name,
            email,
            password,
            role: role || 'patron' //Defalt role to 'patron' if not provided
        });

        // Don't send password in response
        newUser.password = undefined;

        const token = signToken(newUser.id);

        res.status(201).json({
           status: 'success',
            token,
            data: {
                user: newUser
            },
        });
    } catch (error) {
        if(error.name === 'SequelizeUniqueConstraintError') {
            return next(new errorBridge('User with this email already exist!', 409));
        }
        next(error); // pass other error to global error handler
    }
};


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) check if email and password exist
        if(!email||!password) {
            return next(new errorBridge('Please provide email and password!', 400));
        }

        //2) Check if user exists && password is correcct
        const user = await user.findOne({ where: { email }});

        if(!user || !(await user.correctPassword(password, user.password))) {
            return next(new errorBridge('incorrect email or password', 401));
        }

        // 3) if everything is ok, send token to client
        const token = signToken(user.id);
        user.password = undefined; // Don't send password in response

        res.status(200).json({
            status: 'suscess',
            token,
            data: {
                user
            }
        });
   } catch (error) {
    next(error);
   }
};