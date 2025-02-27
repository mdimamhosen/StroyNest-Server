import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['SurjoPay'], required: true },
    address: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', OrderSchema);
