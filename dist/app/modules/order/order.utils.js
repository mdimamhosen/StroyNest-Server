"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderUtils = exports.genarateOrderID = void 0;
const config_1 = __importDefault(require("../../config"));
const order_model_1 = require("./order.model");
const shurjopay_1 = __importDefault(require("shurjopay"));
const findLastOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastOrder = yield order_model_1.Order.findOne({}, { id: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
    return (lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.id) ? lastOrder.id.substring(2) : undefined;
});
const genarateOrderID = () => __awaiter(void 0, void 0, void 0, function* () {
    let currentProductId = (0).toString().padStart(4, '0');
    const lastOrderId = yield findLastOrder();
    console.log('Last Order ID:', lastOrderId);
    if (lastOrderId) {
        currentProductId = (Number(lastOrderId) + 1).toString().padStart(4, '0');
    }
    else {
        currentProductId = (1).toString().padStart(4, '0');
    }
    const productId = `O-${currentProductId}`;
    console.log('Generated Order ID:', productId);
    return productId;
});
exports.genarateOrderID = genarateOrderID;
const shurjopay = new shurjopay_1.default();
const con = shurjopay.config(config_1.default.sp_endpoint, config_1.default.sp_username, config_1.default.sp_password, config_1.default.sp_prefix, config_1.default.sp_return_url);
console.log('Shurjopay Configured', con);
const makePaymentAsync = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
paymentPayload) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        console.log('Payment Payload"', paymentPayload);
        shurjopay.makePayment(paymentPayload, response => resolve(response), error => reject(error));
    });
});
const verifyPaymentAsync = (order_id) => {
    return new Promise((resolve, reject) => {
        shurjopay.verifyPayment(order_id, response => resolve(response), error => reject(error));
    });
};
exports.orderUtils = {
    makePaymentAsync,
    verifyPaymentAsync,
};
