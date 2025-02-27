"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_validation_1 = require("./product.validation");
const product_controller_1 = require("./product.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post('/create-product', sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    console.log('req.body.data', req.body.data);
    console.log('req.file', req.file);
    req.body = JSON.parse(req.body.data);
    next();
}, (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(product_validation_1.ProductValidation.createProductValidation), product_controller_1.ProductController.createProduct);
router.get('/get-product/:id', (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.user), product_controller_1.ProductController.getProductById);
router.delete('/delete-product/:id', (0, auth_1.default)(user_const_1.USER_ROLE.admin), product_controller_1.ProductController.deleteProduct);
router.put('/update-product/:id', (0, auth_1.default)(user_const_1.USER_ROLE.admin), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    console.log('req.body.data', req.body.data);
    console.log('req.file', req.file);
    req.body = JSON.parse(req.body.data);
    next();
}, (0, auth_1.default)(user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(product_validation_1.ProductValidation.updateProductValidation), product_controller_1.ProductController.updateProduct);
router.get('/get-all-products', product_controller_1.ProductController.getAllProducts);
router.get('/all-products', product_controller_1.ProductController.getAllProductsForUser);
exports.ProductRoutes = router;
