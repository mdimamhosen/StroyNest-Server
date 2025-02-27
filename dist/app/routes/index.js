"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const user_routes_1 = require("../modules/user/user.routes");
const product_routes_1 = require("../modules/product/product.routes");
const order_routes_1 = require("../modules/order/order.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        module: auth_route_1.AuthRoutes,
    },
    {
        path: '/user',
        module: user_routes_1.UserRoutes,
    },
    {
        path: '/product',
        module: product_routes_1.ProductRoutes,
    },
    {
        path: '/order',
        module: order_routes_1.orderRoutes,
    },
];
moduleRoutes.forEach(route => {
    router.use(route.path, route.module);
});
exports.routes = router;
