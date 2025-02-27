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
exports.OrderController = void 0;
const catchAsyncResponse_1 = __importDefault(require("../../utils/catchAsyncResponse"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
const createOrder = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Order Request', req.body);
    const result = yield order_service_1.OrderService.createOrder(req.body, req.ip);
    const data = {
        success: true,
        statusCode: 201,
        message: 'Order created successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const getOrders = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.getOrders();
    const data = {
        success: true,
        statusCode: 200,
        message: 'Orders fetched successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const verifyPayment = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Verify Payment Request', req.params);
    const result = yield order_service_1.OrderService.verifyPaymentDB(req.params.id);
    const data = {
        success: true,
        statusCode: 200,
        message: 'Payment verified successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const getOrderById = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.getOrderById(req.params.id);
    const data = {
        success: true,
        statusCode: 200,
        message: 'Order fetched successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const updateOrder = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Update Order Request', req.body);
    const result = yield order_service_1.OrderService.updateOrder(req.params.id, req.body);
    const data = {
        success: true,
        statusCode: 200,
        message: 'Order updated successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const allOrders = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('All Orders Request');
    const result = yield order_service_1.OrderService.allOrders();
    const data = {
        success: true,
        statusCode: 200,
        message: 'Orders fetched successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
exports.OrderController = {
    createOrder,
    getOrders,
    getOrderById,
    verifyPayment,
    updateOrder,
    allOrders,
};
