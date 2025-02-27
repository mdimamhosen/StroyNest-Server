import { AppError } from '../../utils/AppError';
import { Order } from '../order/order.model';
import { Product } from '../product/product.model';
import { IUser } from './user.interface';
import { User } from './user.model';
import { genarateUserId } from './user.utils';

const createUser = async (payload: IUser) => {
  const UserData: Partial<IUser> = {};

  UserData.role = 'user';
  UserData.email = payload.email;
  UserData.password = payload.password;
  UserData.name = payload.name;

  UserData.id = await genarateUserId();

  const newUser = await User.create(UserData);

  if (!newUser) {
    throw new Error('User not created');
  }
  return newUser;
};

const getAllUsers = async () => {
  const users = await User.find({
    role: 'user',
  }).lean();
  return users;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const isUserExist = await User.findOne({ id });
  if (!isUserExist) {
    throw new AppError('User not found', 404);
  }

  const updatedUser = await User.findOneAndUpdate({ id }, payload, {
    new: true,
  });

  return updatedUser;
};

const getAllAuthors = async () => {
  const authors = await User.find({
    role: 'admin',
  }).lean();
  return authors;
};

const getProfileData = async (id: string) => {
  console.log(id);
  const user = await User.findOne({ id: id }).lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const role = user.role;

  if (role === 'admin') {
    // Get total number of orders placed by all users
    const totalOrders = await Order.countDocuments();

    // Get total number of products in the system
    const totalProducts = await Product.countDocuments();

    // Calculate total sales from all orders
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    // Get all users with their orders
    const usersWithOrders = await User.find().lean();
    const usersData = await Promise.all(
      usersWithOrders.map(async user => {
        const orders = await Order.find({ user: user._id })
          .populate('product')
          .lean();
        return { ...user, orders };
      }),
    );

    // Get orders with createdAt for chart
    const ordersWithDate = await Order.find(
      {},
      { createdAt: 1, totalPrice: 1 },
    ).lean();

    return {
      role,
      totalOrders,
      totalProducts,
      totalSales: totalSales[0]?.totalRevenue || 0,
      usersData,
      ordersWithDate,
    };
  } else {
    // Get user orders and calculate total amount spent per month
    const userOrders = await Order.find({ user: user._id })
      .populate('product')
      .lean();

    const monthlySpending = await Order.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalSpent: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      user,
      orders: userOrders,
      monthlySpending,
    };
  }
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  getAllAuthors,
  getProfileData,
};
