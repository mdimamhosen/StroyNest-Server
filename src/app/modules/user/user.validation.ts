import { z } from 'zod';

const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const updateUserValidation = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email format').optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional(),
    isDeleted: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
  }),
});

export const UserValidation = {
  createUserValidation,
  updateUserValidation,
};
