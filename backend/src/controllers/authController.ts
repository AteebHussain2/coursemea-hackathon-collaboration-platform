import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// Generate Access Token (Short lived)
const generateAccessToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'],
    });
};

// Generate Refresh Token (Long lived)
const generateRefreshToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
    });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            // Save refresh token in DB
            user.refreshToken = refreshToken;
            await user.save();

            // Send refresh token in HttpOnly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true, // Required for SameSite: 'none'
                sameSite: 'none', // Required for cross-domain Vercel cookies
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    token: accessToken,
                },
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.comparePassword(password))) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            user.refreshToken = refreshToken;
            await user.save();

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    token: accessToken,
                },
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Public
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = '';
            await user.save();
        }
    }

    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            res.status(401).json({ success: false, message: 'No refresh token' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            res.status(401).json({ success: false, message: 'Invalid refresh token' });
            return;
        }

        const accessToken = generateAccessToken(user.id);
        res.status(200).json({
            success: true,
            data: {
                token: accessToken,
            },
        });
    } catch (error: any) {
        res.status(401).json({ success: false, message: 'Refresh failed' });
    }
};
