import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema<IUser, UserModel>(
  {
    id: { type: String, unique: true, trim: true, required: true },
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// hashing the password before saving the user
UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, Number(10));
  next();
});

// removing the password from the response
UserSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

UserSchema.statics.isUserExist = async function (email: string) {
  const isUser = await User.findOne({ email }).select('password');
  if (!isUser) return false;
  return true;
};
UserSchema.statics.isUserBlocked = async function (email: string) {
  const isUser = await User.findOne({ email, isBlocked: true }).select(
    'password',
  );
  if (!isUser) return false;
  return true;
};

UserSchema.statics.isUserDeleted = async function (email: string) {
  const isUser = await User.findOne({ email, isDeleted: true });
  if (!isUser) return false;
  return true;
};

UserSchema.statics.isPasswordMatched = async function (
  password: string,
  email: string,
) {
  const user = await User.findOne({ email }).select('password');
  if (!user) return false;
  const isPass = await bcrypt.compare(password, user.password);

  return isPass;
};
UserSchema.statics.isJwtIssuedBeforePasswordChange = function (
  passwordChangeTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  console.log({
    passwordChangeTimeStamp: passwordChangeTimeStamp.getTime() / 1000,
    jwtIssuedTimeStamp: jwtIssuedTimeStamp,
  });
  if (passwordChangeTimeStamp.getTime() / 1000 > jwtIssuedTimeStamp) {
    return true;
  }
  return false;
};
export const User = model<IUser, UserModel>('User', UserSchema);
