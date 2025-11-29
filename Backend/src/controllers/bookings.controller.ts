import { Request, Response, NextFunction } from 'express';
import Booking, { BookingStatus } from '../models/Booking';
import Tour from '../models/Tour';
import User from '../models/User';

export async function createBooking(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const { tourId, numberOfPersons } = req.body;

        const tour = await Tour.findByPk(tourId);
        if (!tour) {
            return next({
                status: 404,
                message: 'Tour not found'
            });
        }

        if (tour.availableSpots < numberOfPersons) {
            return next({
                status: 400,
                message: 'Not enough available spots'
            });
        }

        const totalPrice = tour.price * numberOfPersons;

        const booking = await Booking.create({
            userId,
            tourId,
            numberOfPersons,
            totalPrice,
            status: BookingStatus.Pending
        });

        // Update available spots
        await tour.update({
            availableSpots: tour.availableSpots - numberOfPersons
        });

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        next(error);
    }
}

export async function getMyBookings(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const { count, rows: bookings } = await Booking.findAndCountAll({
            where: { userId },
            include: [{
                model: Tour,
                as: 'tour'
            }],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            bookings,
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

export async function getAllBookings(req: Request, res: Response, next: NextFunction) {
    try {
        // Only admins can view all bookings
        if (req.user!.role !== 'Admin') {
            return next({
                status: 403,
                message: 'Only admins can view all bookings'
            });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const { count, rows: bookings } = await Booking.findAndCountAll({
            include: [
                {
                    model: Tour,
                    as: 'tour'
                },
                {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password'] }
                }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            bookings,
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

export async function updateBookingStatus(req: Request, res: Response, next: NextFunction) {
    try {
        // Only admins can update booking status
        if (req.user!.role !== 'Admin') {
            return next({
                status: 403,
                message: 'Only admins can update booking status'
            });
        }

        const bookingId = parseInt(req.params.id);
        const { status } = req.body;

        const booking = await Booking.findByPk(bookingId, {
            include: [{
                model: Tour,
                as: 'tour'
            }]
        });

        if (!booking) {
            return next({
                status: 404,
                message: 'Booking not found'
            });
        }

        await booking.update({ status });
        res.json({
            message: 'Booking status updated successfully',
            booking
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteBooking(req: Request, res: Response, next: NextFunction) {
    try {
        // Only admins can delete bookings
        if (req.user!.role !== 'Admin') {
            return next({
                status: 403,
                message: 'Only admins can delete bookings'
            });
        }

        const bookingId = parseInt(req.params.id);

        const booking = await Booking.findByPk(bookingId, {
            include: [{
                model: Tour,
                as: 'tour'
            }]
        });

        if (!booking) {
            return next({
                status: 404,
                message: 'Booking not found'
            });
        }

        // Restore available spots before deleting
        if (booking.tour) {
            await booking.tour.update({
                availableSpots: booking.tour.availableSpots + booking.numberOfPersons
            });
        }

        await booking.destroy();
        res.json({
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}
