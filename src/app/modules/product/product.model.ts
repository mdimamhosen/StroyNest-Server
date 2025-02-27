import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const ProductSchema = new Schema<IProduct>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String },
  isDeleted: { type: Boolean, default: false },
});

ProductSchema.pre('find', function (next) {
  this.where({ isDeleted: false });
  next();
});

ProductSchema.pre('findOne', function (next) {
  this.where({ isDeleted: false });
  next();
});

ProductSchema.pre('findOneAndUpdate', function (next) {
  this.where({ isDeleted: false });
  next();
});

ProductSchema.pre('countDocuments', function (next) {
  this.where({ isDeleted: false });
  next();
});

export const Product = model<IProduct>('Product', ProductSchema);
