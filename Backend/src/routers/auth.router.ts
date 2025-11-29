import { Router } from 'express';
import Joi from 'joi';
import validation from '../middlewares/validation';
import * as authController from '../controllers/auth.controller';

const router = Router();

const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('User', 'Admin').optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

router.post('/register', validation(registerSchema), authController.register);
router.post('/login', validation(loginSchema), authController.login);

export default router;
