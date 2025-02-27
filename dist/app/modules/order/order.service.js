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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const AppError_1 = require("../../utils/AppError");
const product_model_1 = require("../product/product.model");
const order_model_1 = require("./order.model");
const order_utils_1 = require("./order.utils");
const createOrder = (order, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    const OrderData = {};
    OrderData.paymentMethod = order.paymentMethod;
    OrderData.product = order.product;
    OrderData.quantity = order.quantity;
    OrderData.status = order.status;
    OrderData.totalPrice = order.totalPrice;
    OrderData.user = order.user;
    OrderData.id = yield (0, order_utils_1.genarateOrderID)();
    OrderData.name = order.name;
    OrderData.email = order.email;
    OrderData.address = order.address;
    //
    //
    const response = yield order_model_1.Order.create(OrderData);
    const findProduct = yield product_model_1.Product.findById(order.product);
    if ((findProduct === null || findProduct === void 0 ? void 0 : findProduct.stock) && findProduct.stock < order.quantity) {
        throw new AppError_1.AppError('Product out of stock', 400);
    }
    yield product_model_1.Product.findByIdAndUpdate(order.product, {
        $inc: { stock: -order.quantity },
    });
    //   decrementProductStock(order.product, order.quantity);
    const shurjopayPayload = {
        amount: order.totalPrice,
        order_id: response._id,
        currency: 'USD',
        customer_name: order.name,
        customer_email: order.email,
        customer_address: order.address,
        customer_phone: '01700000000',
        customer_city: 'Dhaka',
        client_ip,
    };
    console.log('Shurjopay Payload:', shurjopayPayload);
    const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
    console.log('Payment:', payment);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        yield order_model_1.Order.findByIdAndUpdate(response._id, {
            $set: {
                transaction: {
                    id: payment.sp_order_id,
                    transactionStatus: payment.transactionStatus,
                },
            },
        }, {
            new: true,
        });
    }
    return payment.checkout_url;
});
const getOrders = () => __awaiter(void 0, void 0, void 0, function* () { });
const verifyPaymentDB = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        yield order_model_1.Order.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status == 'Success'
                ? 'paid'
                : verifiedPayment[0].bank_status == 'Failed'
                    ? 'failed'
                    : verifiedPayment[0].bank_status == 'Pending'
                        ? 'pending'
                        : verifiedPayment[0].bank_status == 'Cancel'
                            ? 'cancelled'
                            : '',
        });
    }
    return verifiedPayment;
});
const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.find({ user: id })
        .populate('product')
        .populate('user');
    return order;
});
const updateOrder = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isOrderExist = yield order_model_1.Order.findOne({ id });
    if (!isOrderExist) {
        throw new AppError_1.AppError('Order not found', 404);
    }
    const updatedOrder = yield order_model_1.Order.findOneAndUpdate({ id }, payload, {
        new: true,
    });
    return updatedOrder;
});
const allOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('All Orders Request------');
    const orders = yield order_model_1.Order.find({}).populate('product').populate('user');
    console.log('Orders:', orders);
    return orders;
});
exports.OrderService = {
    createOrder,
    getOrders,
    verifyPaymentDB,
    getOrderById,
    updateOrder,
    allOrders,
};
