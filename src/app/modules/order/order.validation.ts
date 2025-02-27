import { z } from 'zod';

const createOrderValidation = z.object({
  body: z.object({
    product: z.string().nonempty(),
    quantity: z.number().int().positive(),
    totalPrice: z.number().int().positive(),
    name: z.string().nonempty(),
    email: z.string().email(),
    address: z.string().nonempty(),
    paymentMethod: z.enum(['SurjoPay']),
    transaction: z
      .object({
        id: z.string().optional(),
        transactionStatus: z.string().optional(),
        bank_status: z.string().optional(),
        sp_code: z.string().optional(),
        sp_message: z.string().optional(),
        method: z.string().optional(),
        date_time: z.string().optional(),
      })
      .optional(),
  }),
});

const updateOrderValidation = z.object({
  body: z.object({
    status: z.string().optional(),
  }),
});

export const orderValidation = {
  createOrderValidation,
  updateOrderValidation,
};
