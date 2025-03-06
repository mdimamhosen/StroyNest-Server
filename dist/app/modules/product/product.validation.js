"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().nonempty('Title is required'),
        author: zod_1.z.string().nonempty('Author is required'),
        category: zod_1.z.string().nonempty('Category is required'),
        price: zod_1.z.number().positive('Price must be a positive number'),
        stock: zod_1.z.number().int().positive('Stock must be a positive integer'),
        image: zod_1.z.string().nonempty('Image is required'),
        description: zod_1.z.string().optional(),
    }),
});
const updateProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        author: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        stock: zod_1.z.number().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
    }),
});
exports.ProductValidation = {
    createProductValidation,
    updateProductValidation,
};
