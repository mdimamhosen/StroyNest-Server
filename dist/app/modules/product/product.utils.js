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
exports.genarateProductId = void 0;
const product_model_1 = require("./product.model");
const findLastProductId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastProduct = yield product_model_1.Product.findOne({}, { id: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
    return (lastProduct === null || lastProduct === void 0 ? void 0 : lastProduct.id) ? lastProduct.id.substring(2) : undefined;
});
const genarateProductId = () => __awaiter(void 0, void 0, void 0, function* () {
    let currentProductId = (0).toString().padStart(4, '0');
    const lastProductId = yield findLastProductId();
    if (lastProductId) {
        currentProductId = (Number(lastProductId) + 1).toString().padStart(4, '0');
    }
    else {
        currentProductId = (1).toString().padStart(4, '0');
    }
    const productId = `P-${currentProductId}`;
    return productId;
});
exports.genarateProductId = genarateProductId;
