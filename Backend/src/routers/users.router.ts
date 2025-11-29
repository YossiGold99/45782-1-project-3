import { Router } from 'express';
import * as usersController from '../controllers/users.controller';

const router = Router();

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.post('/:id/follow', usersController.followUser);
router.delete('/:id/follow', usersController.unfollowUser);
router.get('/:id/followers', usersController.getFollowers);
router.get('/:id/following', usersController.getFollowing);

export default router;
