import config from '../../config';
import { Order } from './order.model';
import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
const findLastOrder = async () => {
  const lastOrder = await Order.findOne({}, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastOrder?.id ? lastOrder.id.substring(2) : undefined;
};

export const genarateOrderID = async () => {
  let currentProductId = (0).toString().padStart(4, '0');
  const lastOrderId = await findLastOrder();

  console.log('Last Order ID:', lastOrderId);

  if (lastOrderId) {
    currentProductId = (Number(lastOrderId) + 1).toString().padStart(4, '0');
  } else {
    currentProductId = (1).toString().padStart(4, '0');
  }

  const productId = `O-${currentProductId}`;
  console.log('Generated Order ID:', productId);
  return productId;
};

const shurjopay = new Shurjopay();

const con = shurjopay.config(
  config.sp_endpoint!,
  config.sp_username!,
  config.sp_password!,
  config.sp_prefix!,
  config.sp_return_url!,
);

console.log('Shurjopay Configured', con);

const makePaymentAsync = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentPayload: any,
): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    console.log('Payment Payload"', paymentPayload);
    shurjopay.makePayment(
      paymentPayload,
      response => resolve(response),
      error => reject(error),
    );
  });
};

const verifyPaymentAsync = (
  order_id: string,
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      response => resolve(response),
      error => reject(error),
    );
  });
};

export const orderUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};
