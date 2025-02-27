import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
      message: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
      message: 'Password is required',
    }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
      message: 'Old password is required',
    }),
    newPassword: z.string({
      required_error: 'New Password is required',
      message: 'New Password is required',
    }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
      message: 'Refresh token is required',
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
