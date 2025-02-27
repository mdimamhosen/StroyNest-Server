import { RequestHandler } from 'express';
import catchAsyncResponse from '../utils/catchAsyncResponse';
import { AppError } from '../utils/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { TUserRoles } from '../modules/user/user.const';

const auth = (...roles: TUserRoles[]): RequestHandler => {
  return catchAsyncResponse(async (req, res, next) => {
    // Do something

    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(
        'You are not logged in! Please log in to get access.',
        401,
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    const role = decoded.role;
    const email = decoded.email;

    if (!(await User.isUserExist(email))) {
      throw new AppError('User not found', 404);
    }

    if (await User.isUserDeleted(email)) {
      throw new AppError('User is deleted', 400);
    }

    if (await User.isUserBlocked(email)) {
      throw new AppError('User is blocked', 400);
    }

    if (roles.length && !roles.includes(role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403,
      );
    }

    req.user = decoded;
    next();
  });
};

export default auth;
