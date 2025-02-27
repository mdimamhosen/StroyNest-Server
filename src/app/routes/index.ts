import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.routes';
import { ProductRoutes } from '../modules/product/product.routes';
import { orderRoutes } from '../modules/order/order.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    module: AuthRoutes,
  },
  {
    path: '/user',
    module: UserRoutes,
  },
  {
    path: '/product',
    module: ProductRoutes,
  },
  {
    path: '/order',
    module: orderRoutes,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.module);
});

export const routes = router;
