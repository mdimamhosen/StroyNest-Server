import express from 'express';
import { OrderController } from './order.controller';
import ValidateUserRequest from '../../middlewares/validateRequest';
import { orderValidation } from './order.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router = express.Router();
router.get('/', OrderController.getOrders);

router.post(
  '/create-order',
  auth(USER_ROLE.user, USER_ROLE.admin),
  ValidateUserRequest(orderValidation.createOrderValidation),
  OrderController.createOrder,
);

router.get(
  '/verify/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  OrderController.verifyPayment,
);

router.get('/get-order/:id', OrderController.getOrderById);

router.put(
  '/update-order/:id',
  auth(USER_ROLE.admin),
  ValidateUserRequest(orderValidation.updateOrderValidation),
  OrderController.updateOrder,
);

router.get('/all-orders', auth(USER_ROLE.admin), OrderController.allOrders);

export const orderRoutes = router;
