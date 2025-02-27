import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { AppError } from '../../utils/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import httpStatus from 'http-status';
// import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  if (!(await User.isUserExist(email))) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  if (await User.isUserDeleted(email)) {
    throw new AppError('User is deleted', httpStatus.BAD_REQUEST);
  }

  if (await User.isUserBlocked(email)) {
    throw new AppError('User is blocked', httpStatus.BAD_REQUEST);
  }

  if (!(await User.isPasswordMatched(password, email))) {
    throw new AppError('Password is incorrect', httpStatus.BAD_REQUEST);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  // create token and send to the user

  const jwtPayload = {
    _id: user._id,
    id: user.id,
    role: user.role,
    email: user.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwtSecret as string,
    config.jwtExpiration as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwtRefreshSecret as string,
    config.jwtRefreshExpiration as string,
  );

  return { accessToken, refreshToken };
};

const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const { email } = user;
  const { oldPassword, newPassword } = payload;

  if (!(await User.isUserExist(email))) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  if (await User.isUserDeleted(email)) {
    throw new AppError('User is deleted', httpStatus.BAD_REQUEST);
  }
  const isPassMatched = await User.isPasswordMatched(oldPassword, email);
  console.log('isPassMatched', isPassMatched);
  if (isPassMatched === false) {
    throw new AppError('Old password is incorrect', httpStatus.BAD_REQUEST);
  }

  if (await User.isUserBlocked(email)) {
    throw new AppError('User is blocked', httpStatus.BAD_REQUEST);
  }
  console.log({
    newPassword,
    oldPassword,
  });
  const newHashedPassword = await bcrypt.hash(newPassword, Number(10));
  await User.findOneAndUpdate(
    {
      email,
    },
    {
      password: newHashedPassword,
    },
    { new: true, upsert: true },
  );

  return null;
};

const refreshToken = async (refreshToken: string) => {
  const decoded = verifyToken(refreshToken, config.jwtRefreshSecret as string);

  const id = decoded.id;
  const user = await User.findOne({ id });

  // check if user exist
  if (!(await User.isUserExist(id))) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  // check if user is deleted
  if (await User.isUserDeleted(id)) {
    throw new AppError('User is deleted', httpStatus.BAD_REQUEST);
  }

  // check if user is blocked
  if (await User.isUserBlocked(id)) {
    throw new AppError('User is blocked', httpStatus.BAD_REQUEST);
  }

  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  const jwtPayload = {
    _id: user._id,
    id: user.id,
    role: user.role,
    email: user.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwtSecret as string,
    config.jwtExpiration as string,
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
};
