import { Router } from 'express';
import Joi from 'joi';
import validation from '../middlewares/validation';
import * as bookingsController from '../controllers/bookings.controller';

const router = Router();

const createBookingSchema = Joi.object({
    tourId: Joi.number().integer().positive().required(),
    numberOfPersons: Joi.number().integer().positive().required()
});

const updateBookingStatusSchema = Joi.object({
    status: Joi.string().valid('Pending', 'Confirmed', 'Cancelled').required()
});

router.get('/my', bookingsController.getMyBookings);
router.get('/all', bookingsController.getAllBookings);
router.post('/', validation(createBookingSchema), bookingsController.createBooking);
router.put('/:id/status', validation(updateBookingStatusSchema), bookingsController.updateBookingStatus);
router.delete('/:id', bookingsController.deleteBooking);

export default router;
