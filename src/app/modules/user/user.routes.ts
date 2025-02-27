import express from 'express';

import ValidateUserRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';

const router = express.Router();

router.post(
  '/signup',
  ValidateUserRequest(UserValidation.createUserValidation),
  UserController.createUser,
);

router.get('/all-users', UserController.getAllUsers);

router.put(
  '/:id',
  ValidateUserRequest(UserValidation.updateUserValidation),
  UserController.updateUser,
);

router.get('/all-authors', UserController.getAllAuthors);

router.get('/profile-data/:id', UserController.getProfileData);

export const UserRoutes = router;
