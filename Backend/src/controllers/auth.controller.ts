import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { Op } from 'sequelize';
import User, { UserRole } from '../models/User';

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { firstName, lastName, username, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return next({
                status: 409,
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            role: role || UserRole.User
        });

        // Generate JWT token
        const jwtSecret = config.get<string>('app.jwtSecret');
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return next({
                status: 401,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return next({
                status: 401,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const jwtSecret = config.get<string>('app.jwtSecret');
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
}
