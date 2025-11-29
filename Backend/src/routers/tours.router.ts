import { Router } from 'express';
import Joi from 'joi';
import validation from '../middlewares/validation';
import enforceAuth from '../middlewares/enforce-auth';
import * as toursController from '../controllers/tours.controller';

const router = Router();

const createTourSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    destination: Joi.string().required(),
    price: Joi.number().positive().required(),
    duration: Joi.number().integer().positive().required(),
    availableSpots: Joi.number().integer().min(0).required(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    imageUrl: Joi.string().uri().optional(),
    isActive: Joi.boolean().optional()
});

const updateTourSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    destination: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    duration: Joi.number().integer().positive().optional(),
    availableSpots: Joi.number().integer().min(0).optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    imageUrl: Joi.string().uri().optional(),
    isActive: Joi.boolean().optional()
});

// Public routes - no authentication required
router.get('/', toursController.getTours);
router.get('/:id', toursController.getTourById);

// Protected routes - authentication required (admin only)
router.post('/', enforceAuth, validation(createTourSchema), toursController.createTour);
router.put('/:id', enforceAuth, validation(updateTourSchema), toursController.updateTour);
router.delete('/:id', enforceAuth, toursController.deleteTour);

export default router;
