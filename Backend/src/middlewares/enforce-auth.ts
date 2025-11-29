import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../models/User';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export default async function enforceAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return next({
                status: 401,
                message: 'Authentication required'
            });
        }

        const jwtSecret = config.get<string>('app.jwtSecret');
        const decoded = jwt.verify(token, jwtSecret) as { userId: number };
        
        const user = await User.findByPk(decoded.userId);
        
        if (!user) {
            return next({
                status: 401,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        next({
            status: 401,
            message: 'Invalid or expired token'
        });
    }
}
