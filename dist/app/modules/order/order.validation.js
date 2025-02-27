"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const zod_1 = require("zod");
const createOrderValidation = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.string().nonempty(),
        quantity: zod_1.z.number().int().positive(),
        totalPrice: zod_1.z.number().int().positive(),
        name: zod_1.z.string().nonempty(),
        email: zod_1.z.string().email(),
        address: zod_1.z.string().nonempty(),
        paymentMethod: zod_1.z.enum(['SurjoPay']),
        transaction: zod_1.z
            .object({
            id: zod_1.z.string().optional(),
            transactionStatus: zod_1.z.string().optional(),
            bank_status: zod_1.z.string().optional(),
            sp_code: zod_1.z.string().optional(),
            sp_message: zod_1.z.string().optional(),
            method: zod_1.z.string().optional(),
            date_time: zod_1.z.string().optional(),
        })
            .optional(),
    }),
});
const updateOrderValidation = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.string().optional(),
    }),
});
exports.orderValidation = {
    createOrderValidation,
    updateOrderValidation,
};
