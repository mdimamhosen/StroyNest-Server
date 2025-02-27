import express from 'express';
import ValidateUserRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router = express.Router();

router.post(
  '/login',
  ValidateUserRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  ValidateUserRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);

router.post(
  '/refresh-token',
  ValidateUserRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

export const AuthRoutes = router;
