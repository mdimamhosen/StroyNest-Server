"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
});
ProductSchema.pre('find', function (next) {
    this.where({ isDeleted: false });
    next();
});
ProductSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false });
    next();
});
ProductSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false });
    next();
});
ProductSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false });
    next();
});
exports.Product = (0, mongoose_1.model)('Product', ProductSchema);
