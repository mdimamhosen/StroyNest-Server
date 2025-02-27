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
const catchAsyncResponse_1 = __importDefault(require("../utils/catchAsyncResponse"));
const AppError_1 = require("../utils/AppError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../modules/user/user.model");
const auth = (...roles) => {
    return (0, catchAsyncResponse_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Do something
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.AppError('You are not logged in! Please log in to get access.', 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const role = decoded.role;
        const email = decoded.email;
        if (!(yield user_model_1.User.isUserExist(email))) {
            throw new AppError_1.AppError('User not found', 404);
        }
        if (yield user_model_1.User.isUserDeleted(email)) {
            throw new AppError_1.AppError('User is deleted', 400);
        }
        if (yield user_model_1.User.isUserBlocked(email)) {
            throw new AppError_1.AppError('User is blocked', 400);
        }
        if (roles.length && !roles.includes(role)) {
            throw new AppError_1.AppError('You do not have permission to perform this action', 403);
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
