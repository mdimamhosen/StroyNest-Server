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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const config_1 = __importDefault(require("../../config"));
const catchAsyncResponse_1 = __importDefault(require("../../utils/catchAsyncResponse"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const loginUser = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.loginUser(req.body);
    console.log('result', result);
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: config_1.default.nodeEnv === 'production',
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        data: {
            accessToken: result.accessToken,
        },
        message: 'Login Successfully',
        statusCode: 200,
        success: true,
    });
}));
const changePassword = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordData = __rest(req.body, []);
    console.log('passwordData', passwordData);
    console.log('req.user', req.user);
    const result = yield auth_service_1.AuthService.changePassword(req.user, passwordData);
    (0, sendResponse_1.default)(res, {
        data: result,
        message: 'Password changed successfully',
        statusCode: 200,
        success: true,
    });
}));
const refreshToken = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        data: result,
        message: 'Token refreshed successfully',
        statusCode: 200,
        success: true,
    });
}));
exports.AuthController = {
    loginUser,
    changePassword,
    refreshToken,
};
