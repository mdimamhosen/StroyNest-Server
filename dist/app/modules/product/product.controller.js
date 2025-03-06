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
exports.ProductController = void 0;
const catchAsyncResponse_1 = __importDefault(require("../../utils/catchAsyncResponse"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = require("./product.service");
const createProduct = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.createProduct(req.body);
    const data = {
        success: true,
        statusCode: 201,
        message: 'Product created successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const getProductById = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.GetProductById(req.params.id);
    const data = {
        success: true,
        statusCode: 200,
        message: 'Product fetched successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const deleteProduct = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.deleteProduct(req.params.id);
    const data = {
        success: true,
        statusCode: 200,
        message: 'Product deleted successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const updateProduct = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.updateBook(req.params.id, req.body);
    const data = {
        success: true,
        statusCode: 200,
        message: 'Product updated successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const getAllProducts = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.getAllProducts(req.query);
    const data = {
        success: true,
        statusCode: 200,
        message: 'Products fetched successfully',
        data: result,
    };
    (0, sendResponse_1.default)(res, data);
}));
const getAllProductsForUser = (0, catchAsyncResponse_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.getAllProductsForUser(req.query);
    const data = {
        success: true,
        statusCode: 200,
        message: 'Products fetched successfully',
        data: {
            data: result.data,
            meta: result.meta,
        },
    };
    (0, sendResponse_1.default)(res, data);
}));
exports.ProductController = {
    createProduct,
    getProductById,
    deleteProduct,
    getAllProducts,
    updateProduct,
    getAllProductsForUser,
};
