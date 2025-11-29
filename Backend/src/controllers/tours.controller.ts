import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Tour from '../models/Tour';
import Booking from '../models/Booking';
import Like from '../models/Like';

export async function getTours(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search as string || '';
        const destination = req.query.destination as string || '';
        const includeInactive = req.query.includeInactive === 'true';

        const where: any = {};
        
        // Only filter by active status if not including inactive tours
        // Admins can request all tours by passing includeInactive=true
        if (!includeInactive || req.user?.role !== 'Admin') {
            where.isActive = true;
        }
        
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }
        
        if (destination) {
            where.destination = { [Op.like]: `%${destination}%` };
        }

        const { count, rows: tours } = await Tour.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Like,
                as: 'likes',
                attributes: [],
                required: false
            }]
        });

        // Get likes count for each tour
        const toursWithLikes = await Promise.all(
            tours.map(async (tour) => {
                const likesCount = await Like.count({
                    where: { tourId: tour.id }
                });
                return {
                    ...tour.toJSON(),
                    likesCount
                };
            })
        );

        res.json({
            tours: toursWithLikes,
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

export async function getTourById(req: Request, res: Response, next: NextFunction) {
    try {
        const tourId = parseInt(req.params.id);
        const tour = await Tour.findByPk(tourId, {
            include: [{
                model: Booking,
                as: 'bookings'
            }]
        });

        if (!tour) {
            return next({
                status: 404,
                message: 'Tour not found'
            });
        }

        // Get likes count
        const likesCount = await Like.count({
            where: { tourId }
        });

        res.json({
            ...tour.toJSON(),
            likesCount
        });
    } catch (error) {
        next(error);
    }
}

export async function createTour(req: Request, res: Response, next: NextFunction) {
    try {
        // Only admins can create tours
        if (req.user!.role !== 'Admin') {
            return next({
                status: 403,
                message: 'Only admins can create tours'
            });
        }

        const tour = await Tour.create(req.body);
        res.status(201).json({
            message: 'Tour created successfully',
            tour
        });
    } catch (error) {
        next(error);
    }
}

export async function updateTour(req: Request, res: Response, next: NextFunction) {
    try {
        // Only admins can update tours
        if (req.user!.role !== 'Admin') {
            return next({
                status: 403,
                message: 'Only admins can update tours'
            });
        }

        const tourId = parseInt(req.params.id);
        const tour = await Tour.findByPk(tourId);

        if (!tour) {
            return next({
                status: 404,
                message: 'Tour not found'
            });
        }

        await tour.update(req.body);
        res.json({
            message: 'Tour updated successfully',
            tour
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteTour(req: Request, res: Response, next: NextFunction) {
    try {
        // Only admins can delete tours
        if (req.user!.role !== 'Admin') {
            return next({
                status: 403,
                message: 'Only admins can delete tours'
            });
        }

        const tourId = parseInt(req.params.id);
        const tour = await Tour.findByPk(tourId);

        if (!tour) {
            return next({
                status: 404,
                message: 'Tour not found'
            });
        }

        await tour.destroy();
        res.json({
            message: 'Tour deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}
