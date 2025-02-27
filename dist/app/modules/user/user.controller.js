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
exports.UserController = void 0;
const catchAsyncResponse_1 = __importDefault(require("../../utils/catchAsyncResponse"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const createUser = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.createUser(req.body);
    const data = {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'User created successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const getAllUsers = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllUsers();
    const data = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Users fetched successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const updateUser = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.body', req.body);
    console.log('req.params.id', req.params.id);
    const result = yield user_service_1.UserServices.updateUser(req.params.id, req.body);
    const data = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User updated successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const getAllAuthors = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllAuthors();
    const data = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Authors fetched successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const getProfileData = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.params.id', req.params.id);
    const result = yield user_service_1.UserServices.getProfileData(req.params.id);
    const data = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Profile data fetched successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
exports.UserController = {
    createUser,
    getAllUsers,
    updateUser,
    getAllAuthors,
    getProfileData,
};
