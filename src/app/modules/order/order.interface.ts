import { Types } from 'mongoose';

export interface IOrder {
  id: string;
  user: Types.ObjectId;
  product: Types.ObjectId;
  name: string;
  email: string;
  address: string;
  quantity: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'failed';
  totalPrice: number;
  paymentMethod: 'SurjoPay';
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
}
