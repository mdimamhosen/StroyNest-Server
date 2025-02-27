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
exports.UserServices = void 0;
const AppError_1 = require("../../utils/AppError");
const order_model_1 = require("../order/order.model");
const product_model_1 = require("../product/product.model");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const UserData = {};
    UserData.role = 'user';
    UserData.email = payload.email;
    UserData.password = payload.password;
    UserData.name = payload.name;
    UserData.id = yield (0, user_utils_1.genarateUserId)();
    const newUser = yield user_model_1.User.create(UserData);
    if (!newUser) {
        throw new Error('User not created');
    }
    return newUser;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({
        role: 'user',
    }).lean();
    return users;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ id });
    if (!isUserExist) {
        throw new AppError_1.AppError('User not found', 404);
    }
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ id }, payload, {
        new: true,
    });
    return updatedUser;
});
const getAllAuthors = () => __awaiter(void 0, void 0, void 0, function* () {
    const authors = yield user_model_1.User.find({
        role: 'admin',
    }).lean();
    return authors;
});
const getProfileData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(id);
    const user = yield user_model_1.User.findOne({ id: id }).lean();
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    const role = user.role;
    if (role === 'admin') {
        // Get total number of orders placed by all users
        const totalOrders = yield order_model_1.Order.countDocuments();
        // Get total number of products in the system
        const totalProducts = yield product_model_1.Product.countDocuments();
        // Calculate total sales from all orders
        const totalSales = yield order_model_1.Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' },
                },
            },
        ]);
        // Get all users with their orders
        const usersWithOrders = yield user_model_1.User.find().lean();
        const usersData = yield Promise.all(usersWithOrders.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const orders = yield order_model_1.Order.find({ user: user._id })
                .populate('product')
                .lean();
            return Object.assign(Object.assign({}, user), { orders });
        })));
        // Get orders with createdAt for chart
        const ordersWithDate = yield order_model_1.Order.find({}, { createdAt: 1, totalPrice: 1 }).lean();
        return {
            role,
            totalOrders,
            totalProducts,
            totalSales: ((_a = totalSales[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0,
            usersData,
            ordersWithDate,
        };
    }
    else {
        // Get user orders and calculate total amount spent per month
        const userOrders = yield order_model_1.Order.find({ user: user._id })
            .populate('product')
            .lean();
        const monthlySpending = yield order_model_1.Order.aggregate([
            { $match: { user: user._id } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    totalSpent: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return {
            user,
            orders: userOrders,
            monthlySpending,
        };
    }
});
exports.UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    getAllAuthors,
    getProfileData,
};
