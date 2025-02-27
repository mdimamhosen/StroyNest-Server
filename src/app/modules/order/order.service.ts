import { AppError } from '../../utils/AppError';
import { Product } from '../product/product.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { genarateOrderID, orderUtils } from './order.utils';

const createOrder = async (order: IOrder, client_ip: string) => {
  const OrderData: Partial<IOrder> = {};
  OrderData.paymentMethod = order.paymentMethod;
  OrderData.product = order.product;
  OrderData.quantity = order.quantity;
  OrderData.status = order.status;
  OrderData.totalPrice = order.totalPrice;
  OrderData.user = order.user;
  OrderData.id = await genarateOrderID();
  OrderData.name = order.name;
  OrderData.email = order.email;
  OrderData.address = order.address;
  //

  //

  const response = await Order.create(OrderData);

  const findProduct = await Product.findById(order.product);

  if (findProduct?.stock && findProduct.stock < order.quantity) {
    throw new AppError('Product out of stock', 400);
  }

  await Product.findByIdAndUpdate(order.product, {
    $inc: { stock: -order.quantity },
  });
  //   decrementProductStock(order.product, order.quantity);

  const shurjopayPayload = {
    amount: order.totalPrice,
    order_id: response._id,
    currency: 'USD',
    customer_name: order.name,
    customer_email: order.email,
    customer_address: order.address,
    customer_phone: '01700000000',
    customer_city: 'Dhaka',
    client_ip,
  };
  console.log('Shurjopay Payload:', shurjopayPayload);

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  console.log('Payment:', payment);

  if (payment?.transactionStatus) {
    await Order.findByIdAndUpdate(
      response._id,
      {
        $set: {
          transaction: {
            id: payment.sp_order_id,
            transactionStatus: payment.transactionStatus,
          },
        },
      },
      {
        new: true,
      },
    );
  }

  return payment.checkout_url;
};

const getOrders = async () => {};

const verifyPaymentDB = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'failed'
              : verifiedPayment[0].bank_status == 'Pending'
                ? 'pending'
                : verifiedPayment[0].bank_status == 'Cancel'
                  ? 'cancelled'
                  : '',
      },
    );
  }

  return verifiedPayment;
};

const getOrderById = async (id: string) => {
  const order = await Order.find({ user: id })
    .populate('product')
    .populate('user');
  return order;
};
const updateOrder = async (id: string, payload: Partial<IOrder>) => {
  const isOrderExist = await Order.findOne({ id });
  if (!isOrderExist) {
    throw new AppError('Order not found', 404);
  }
  const updatedOrder = await Order.findOneAndUpdate({ id }, payload, {
    new: true,
  });

  return updatedOrder;
};
const allOrders = async () => {
  console.log('All Orders Request------');
  const orders = await Order.find({}).populate('product').populate('user');
  console.log('Orders:', orders);
  return orders;
};

export const OrderService = {
  createOrder,
  getOrders,
  verifyPaymentDB,
  getOrderById,
  updateOrder,
  allOrders,
};
