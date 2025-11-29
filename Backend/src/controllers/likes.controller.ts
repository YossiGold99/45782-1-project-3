import { Request, Response, NextFunction } from 'express';
import Like from '../models/Like';
import Tour from '../models/Tour';

export async function likeTour(req: Request, res: Response, next: NextFunction) {
    try {
        const currentUserId = req.user!.id;
        const tourId = parseInt(req.params.id);

        const tour = await Tour.findByPk(tourId);
        if (!tour) {
            return next({
                status: 404,
                message: 'Tour not found'
            });
        }

        const [like, created] = await Like.findOrCreate({
            where: {
                userId: currentUserId,
                tourId
            },
            defaults: {
                userId: currentUserId,
                tourId
            }
        });

        if (!created) {
            return next({
                status: 409,
                message: 'Already liked this tour'
            });
        }

        res.status(201).json({
            message: 'Tour liked successfully',
            like
        });
    } catch (error) {
        next(error);
    }
}

export async function unlikeTour(req: Request, res: Response, next: NextFunction) {
    try {
        const currentUserId = req.user!.id;
        const tourId = parseInt(req.params.id);

        const like = await Like.findOne({
            where: {
                userId: currentUserId,
                tourId
            }
        });

        if (!like) {
            return next({
                status: 404,
                message: 'Tour not liked'
            });
        }

        await like.destroy();

        res.json({
            message: 'Tour unliked successfully'
        });
    } catch (error) {
        next(error);
    }
}

export async function getTourLikes(req: Request, res: Response, next: NextFunction) {
    try {
        const tourId = parseInt(req.params.id);
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const likes = await Like.findAll({
            where: { tourId },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Tour,
                as: 'tour'
            }]
        });

        const total = await Like.count({
            where: { tourId }
        });

        res.json({
            likes,
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

export async function checkUserLiked(req: Request, res: Response, next: NextFunction) {
    try {
        const currentUserId = req.user!.id;
        const tourId = parseInt(req.params.id);

        const like = await Like.findOne({
            where: {
                userId: currentUserId,
                tourId
            }
        });

        res.json({
            liked: !!like
        });
    } catch (error) {
        next(error);
    }
}
