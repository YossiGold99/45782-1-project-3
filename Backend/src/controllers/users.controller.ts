import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import User from '../models/User';
import Follow from '../models/Follow';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10; // 10 items per page
        const offset = (page - 1) * limit;
        const search = req.query.search as string || '';

        const where: any = {};
        if (search) {
            where[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: users } = await User.findAndCountAll({
            where,
            limit,
            offset,
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            users,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = parseInt(req.params.id);
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return next({
                status: 404,
                message: 'User not found'
            });
        }

        // Get followers count
        const followersCount = await Follow.count({
            where: { followingId: userId }
        });

        // Get following count
        const followingCount = await Follow.count({
            where: { followerId: userId }
        });

        res.json({
            ...user.toJSON(),
            followersCount,
            followingCount
        });
    } catch (error) {
        next(error);
    }
}

export async function followUser(req: Request, res: Response, next: NextFunction) {
    try {
        const currentUserId = req.user!.id;
        const followingId = parseInt(req.params.id);

        if (currentUserId === followingId) {
            return next({
                status: 400,
                message: 'Cannot follow yourself'
            });
        }

        const followingUser = await User.findByPk(followingId);
        if (!followingUser) {
            return next({
                status: 404,
                message: 'User to follow not found'
            });
        }

        const [follow, created] = await Follow.findOrCreate({
            where: {
                followerId: currentUserId,
                followingId
            },
            defaults: {
                followerId: currentUserId,
                followingId
            }
        });

        if (!created) {
            return next({
                status: 409,
                message: 'Already following this user'
            });
        }

        res.status(201).json({
            message: 'User followed successfully',
            follow
        });
    } catch (error) {
        next(error);
    }
}

export async function unfollowUser(req: Request, res: Response, next: NextFunction) {
    try {
        const currentUserId = req.user!.id;
        const followingId = parseInt(req.params.id);

        const follow = await Follow.findOne({
            where: {
                followerId: currentUserId,
                followingId
            }
        });

        if (!follow) {
            return next({
                status: 404,
                message: 'Not following this user'
            });
        }

        await follow.destroy();

        res.json({
            message: 'User unfollowed successfully'
        });
    } catch (error) {
        next(error);
    }
}

export async function getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = parseInt(req.params.id);
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const follows = await Follow.findAll({
            where: { followingId: userId },
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        const followerIds = follows.map(f => f.followerId);
        const followers = await User.findAll({
            where: { id: { [Op.in]: followerIds } },
            attributes: { exclude: ['password'] }
        });

        const total = await Follow.count({
            where: { followingId: userId }
        });

        res.json({
            followers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = parseInt(req.params.id);
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const follows = await Follow.findAll({
            where: { followerId: userId },
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        const followingIds = follows.map(f => f.followingId);
        const following = await User.findAll({
            where: { id: { [Op.in]: followingIds } },
            attributes: { exclude: ['password'] }
        });

        const total = await Follow.count({
            where: { followerId: userId }
        });

        res.json({
            following,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
}
