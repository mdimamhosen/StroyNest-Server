import { Model } from 'mongoose';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface UserModel extends Model<IUser> {
  isUserBlocked(email: string): Promise<boolean>;
  isUserExist(email: string): Promise<boolean>;
  isPasswordMatched(email: string, password: string): Promise<boolean>;
  isUserDeleted(email: string): Promise<boolean>;
  isJwtIssuedBeforePasswordChange(
    passwordChangeTime: Date,
    jwtIssuedTime: number,
  ): boolean;
}
