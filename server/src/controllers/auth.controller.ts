import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../middlewares/error.middleware';
import { catchAsync } from '../utils/catchAsync';

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user,
        },
    });
};

/**
 * @desc    Admin/Tenant Login
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1. Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2. Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password as string))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3. Ensure user is authorized to login to dashboard
    if (user.role === 'shopper') {
        return next(new AppError('Shoppers must use the mobile app.', 403));
    }

    // 4. Send token
    createSendToken(user, 200, res);
});

/**
 * @desc    Create initial admin (Seed helper)
 * @route   POST /api/v1/auth/register-admin-secret
 * @access  Public (Should be protected by IP or disabled in prod)
 */
export const registerAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        email,
        password: hashedPassword,
        role: 'admin',
        profile: {
            firstName,
            lastName
        }
    });

    createSendToken(newUser, 201, res);
});
