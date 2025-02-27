"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['SurjoPay'], required: true },
    address: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    transaction: {
        id: String,
        transactionStatus: String,
        bank_status: String,
        sp_code: String,
        sp_message: String,
        method: String,
        date_time: String,
    },
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);
