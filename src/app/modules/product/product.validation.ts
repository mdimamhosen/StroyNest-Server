import { z } from 'zod';

const createProductValidation = z.object({
  body: z.object({
    title: z.string().nonempty('Title is required'),
    author: z.string().nonempty('Author is required'),
    category: z.string().nonempty('Category is required'),
    price: z.number().positive('Price must be a positive number'),
    stock: z.number().int().positive('Stock must be a positive integer'),
    image: z.string().nonempty('Image is required'),
    description: z.string().optional(),
  }),
});

const updateProductValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    category: z.string().optional(),
    price: z.number().optional(),
    stock: z.number().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const ProductValidation = {
  createProductValidation,
  updateProductValidation,
};
