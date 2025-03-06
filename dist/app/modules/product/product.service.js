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
exports.ProductService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = require("../../utils/AppError");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const product_model_1 = require("./product.model");
const product_utils_1 = require("./product.utils");
const http_status_1 = __importDefault(require("http-status"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Payload ->', payload);
    const productData = {};
    productData.title = payload.title;
    productData.author = payload.author;
    productData.category = payload.category;
    productData.price = payload.price;
    productData.stock = payload.stock;
    productData.image = payload.image;
    productData.description = (payload === null || payload === void 0 ? void 0 : payload.description) || '';
    productData.id = yield (0, product_utils_1.genarateProductId)();
    const product = yield product_model_1.Product.create(productData);
    if (!product) {
        throw new AppError_1.AppError('Product not created', 500);
    }
    return product;
});
const GetProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield product_model_1.Product.findById(id).populate('author');
    if (!book) {
        throw new AppError_1.AppError('Book not found', http_status_1.default.NOT_FOUND);
    }
    return book;
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookExist = yield product_model_1.Product.findById(id);
    if (!isBookExist) {
        throw new AppError_1.AppError("Book can't be updated", http_status_1.default.NOT_FOUND);
    }
    const result = yield product_model_1.Product.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
    });
    return result;
});
const updateBook = (id, payload, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
file) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookExist = yield product_model_1.Product.findOne({ id });
    if (!isBookExist) {
        throw new AppError_1.AppError('Book not found', http_status_1.default.NOT_FOUND);
    }
    const imageName = `${id}-${payload.title}`;
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.uploadImageToCloudinary)(file.path, imageName, 'product');
        payload.image = secure_url;
    }
    const updatedBook = yield product_model_1.Product.findOneAndUpdate({ id }, payload, {
        new: true,
    }).populate('author');
    if (!updatedBook) {
        throw new AppError_1.AppError("Book can't be updated", http_status_1.default.INTERNAL_SERVER_ERROR);
    }
    return updatedBook;
});
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const allBooks = new QueryBuilder_1.default(product_model_1.Product.find().populate('author'), query)
        .searchTerm(['title', 'description', 'category'])
        .filter()
        .sort()
        .fields()
        .pagination();
    const data = yield allBooks.modelQuery;
    const meta = yield allBooks.countTotal();
    return { data, meta };
});
const getAllProductsForUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Process query parameters
    Object.keys(query).forEach(key => {
        if (query[key] === 'undefined') {
            query[key] = undefined;
        }
        if (query[key] === 'true') {
            query[key] = true;
        }
        if (key === 'priceRange') {
            query[key] = query[key]
                .split(',')
                .map((price) => parseInt(price, 10));
        }
        if (key === 'page') {
            query[key] = parseInt(query[key], 10);
        }
    });
    console.log('query', query);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter = {};
    if (query.searchTerm) {
        const searchTerm = query.searchTerm;
        const searchableFields = ['title', 'description', 'category', 'author'];
        filter.$or = searchableFields.map(field => ({
            [field]: { $regex: searchTerm, $options: 'i' },
        }));
    }
    if (query.category) {
        filter.category = query.category;
    }
    if (query.author) {
        filter.author = query.author;
    }
    if (query.availability !== undefined) {
        filter.stock = { $gt: 0 };
    }
    if (query.priceRange) {
        const priceRange = query.priceRange;
        filter.price = { $gte: priceRange[0], $lte: priceRange[1] };
    }
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;
    const allBooks = yield product_model_1.Product.find(filter)
        .skip(skip)
        .limit(limit)
        .populate('author');
    const total = yield product_model_1.Product.countDocuments(filter);
    const totalPage = Math.ceil(total / limit);
    const meta = {
        total,
        page,
        limit,
        totalPage,
    };
    return {
        meta: meta,
        data: allBooks,
    };
});
exports.ProductService = {
    createProduct,
    updateBook,
    GetProductById,
    deleteProduct,
    getAllProducts,
    getAllProductsForUser,
};
