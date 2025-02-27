import catchAsyncResponse from '../../utils/catchAsyncResponse';
import sendResponse from '../../utils/sendResponse';
import { OrderService } from './order.service';

const createOrder = catchAsyncResponse(async (req, res) => {
  console.log('Order Request', req.body);
  const result = await OrderService.createOrder(req.body, req.ip!);
  const data = {
    success: true,
    statusCode: 201,
    message: 'Order created successfully',
    data: result,
  };
  sendResponse(res, data);
});

const getOrders = catchAsyncResponse(async (req, res) => {
  const result = await OrderService.getOrders();
  const data = {
    success: true,
    statusCode: 200,
    message: 'Orders fetched successfully',
    data: result,
  };
  sendResponse(res, data);
});

const verifyPayment = catchAsyncResponse(async (req, res) => {
  console.log('Verify Payment Request', req.params);

  const result = await OrderService.verifyPaymentDB(req.params.id);
  const data = {
    success: true,
    statusCode: 200,
    message: 'Payment verified successfully',
    data: result,
  };
  sendResponse(res, data);
});
const getOrderById = catchAsyncResponse(async (req, res) => {
  const result = await OrderService.getOrderById(req.params.id);
  const data = {
    success: true,
    statusCode: 200,
    message: 'Order fetched successfully',
    data: result,
  };
  sendResponse(res, data);
});

const updateOrder = catchAsyncResponse(async (req, res) => {
  console.log('Update Order Request', req.body);
  const result = await OrderService.updateOrder(req.params.id, req.body);
  const data = {
    success: true,
    statusCode: 200,
    message: 'Order updated successfully',
    data: result,
  };
  sendResponse(res, data);
});

const allOrders = catchAsyncResponse(async (req, res) => {
  console.log('All Orders Request');
  const result = await OrderService.allOrders();
  const data = {
    success: true,
    statusCode: 200,
    message: 'Orders fetched successfully',
    data: result,
  };
  sendResponse(res, data);
});
export const OrderController = {
  createOrder,
  getOrders,
  getOrderById,
  verifyPayment,
  updateOrder,
  allOrders,
};
