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
exports.AuthService = void 0;
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../utils/AppError");
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const http_status_1 = __importDefault(require("http-status"));
// import jwt from 'jsonwebtoken';
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    if (!(yield user_model_1.User.isUserExist(email))) {
        throw new AppError_1.AppError('User not found', http_status_1.default.NOT_FOUND);
    }
    if (yield user_model_1.User.isUserDeleted(email)) {
        throw new AppError_1.AppError('User is deleted', http_status_1.default.BAD_REQUEST);
    }
    if (yield user_model_1.User.isUserBlocked(email)) {
        throw new AppError_1.AppError('User is blocked', http_status_1.default.BAD_REQUEST);
    }
    if (!(yield user_model_1.User.isPasswordMatched(password, email))) {
        throw new AppError_1.AppError('Password is incorrect', http_status_1.default.BAD_REQUEST);
    }
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.AppError('User not found', http_status_1.default.NOT_FOUND);
    }
    // create token and send to the user
    const jwtPayload = {
        _id: user._id,
        id: user.id,
        role: user.role,
        email: user.email,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwtSecret, config_1.default.jwtExpiration);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwtRefreshSecret, config_1.default.jwtRefreshExpiration);
    return { accessToken, refreshToken };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = user;
    const { oldPassword, newPassword } = payload;
    if (!(yield user_model_1.User.isUserExist(email))) {
        throw new AppError_1.AppError('User not found', http_status_1.default.NOT_FOUND);
    }
    if (yield user_model_1.User.isUserDeleted(email)) {
        throw new AppError_1.AppError('User is deleted', http_status_1.default.BAD_REQUEST);
    }
    const isPassMatched = yield user_model_1.User.isPasswordMatched(oldPassword, email);
    console.log('isPassMatched', isPassMatched);
    if (isPassMatched === false) {
        throw new AppError_1.AppError('Old password is incorrect', http_status_1.default.BAD_REQUEST);
    }
    if (yield user_model_1.User.isUserBlocked(email)) {
        throw new AppError_1.AppError('User is blocked', http_status_1.default.BAD_REQUEST);
    }
    console.log({
        newPassword,
        oldPassword,
    });
    const newHashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(10));
    yield user_model_1.User.findOneAndUpdate({
        email,
    }, {
        password: newHashedPassword,
    }, { new: true, upsert: true });
    return null;
});
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, auth_utils_1.verifyToken)(refreshToken, config_1.default.jwtRefreshSecret);
    const id = decoded.id;
    const user = yield user_model_1.User.findOne({ id });
    // check if user exist
    if (!(yield user_model_1.User.isUserExist(id))) {
        throw new AppError_1.AppError('User not found', http_status_1.default.NOT_FOUND);
    }
    // check if user is deleted
    if (yield user_model_1.User.isUserDeleted(id)) {
        throw new AppError_1.AppError('User is deleted', http_status_1.default.BAD_REQUEST);
    }
    // check if user is blocked
    if (yield user_model_1.User.isUserBlocked(id)) {
        throw new AppError_1.AppError('User is blocked', http_status_1.default.BAD_REQUEST);
    }
    if (!user) {
        throw new AppError_1.AppError('User not found', http_status_1.default.NOT_FOUND);
    }
    const jwtPayload = {
        _id: user._id,
        id: user.id,
        role: user.role,
        email: user.email,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwtSecret, config_1.default.jwtExpiration);
    return {
        accessToken,
    };
});
exports.AuthService = {
    loginUser,
    changePassword,
    refreshToken,
};
