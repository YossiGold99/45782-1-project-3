import { Router } from 'express';
import * as likesController from '../controllers/likes.controller';

const router = Router();

router.post('/tours/:id/like', likesController.likeTour);
router.delete('/tours/:id/like', likesController.unlikeTour);
router.get('/tours/:id/likes', likesController.getTourLikes);
router.get('/tours/:id/liked', likesController.checkUserLiked);

export default router;
