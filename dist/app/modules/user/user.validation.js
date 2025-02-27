"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
const updateUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
        email: zod_1.z.string().email('Invalid email format').optional(),
        password: zod_1.z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .optional(),
        isDeleted: zod_1.z.boolean().optional(),
        isBlocked: zod_1.z.boolean().optional(),
    }),
});
exports.UserValidation = {
    createUserValidation,
    updateUserValidation,
};
