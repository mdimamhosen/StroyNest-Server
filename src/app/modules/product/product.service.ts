import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../utils/AppError';
import { uploadImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import { genarateProductId } from './product.utils';
import httpStatus from 'http-status';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createProduct = async (payload: IProduct) => {
  console.log('Payload ->', payload);
  const productData: Partial<IProduct> = {};
  productData.title = payload.title;
  productData.author = payload.author;
  productData.category = payload.category;
  productData.price = payload.price;
  productData.stock = payload.stock;
  productData.image = payload.image;
  productData.description = payload?.description || '';

  productData.id = await genarateProductId();

  const product = await Product.create(productData);

  if (!product) {
    throw new AppError('Product not created', 500);
  }
  return product;
};

const GetProductById = async (id: string) => {
  const book = await Product.findById(id).populate('author');

  if (!book) {
    throw new AppError('Book not found', httpStatus.NOT_FOUND);
  }

  return book;
};

const deleteProduct = async (id: string) => {
  const isBookExist = await Product.findById(id);
  if (!isBookExist) {
    throw new AppError("Book can't be updated", httpStatus.NOT_FOUND);
  }

  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );
  return result;
};

const updateBook = async (
  id: string,
  payload: Partial<IProduct>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file?: any,
) => {
  const isBookExist = await Product.findOne({ id });

  if (!isBookExist) {
    throw new AppError('Book not found', httpStatus.NOT_FOUND);
  }

  const imageName = `${id}-${payload.title}`;

  if (file) {
    const { secure_url } = await uploadImageToCloudinary(
      file.path,
      imageName,
      'product',
    );
    payload.image = secure_url;
  }

  const updatedBook = await Product.findOneAndUpdate({ id }, payload, {
    new: true,
  }).populate('author');

  if (!updatedBook) {
    throw new AppError(
      "Book can't be updated",
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return updatedBook;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const allBooks = new QueryBuilder(Product.find().populate('author'), query)
    .searchTerm(['title', 'description', 'category'])
    .filter()
    .sort()
    .fields()
    .pagination();

  const data = await allBooks.modelQuery;
  const meta = await allBooks.countTotal();

  return { data, meta };
};

const getAllProductsForUser = async (query: Record<string, unknown>) => {
  // Process query parameters
  Object.keys(query).forEach(key => {
    if (query[key] === 'undefined') {
      query[key] = undefined;
    }
    if (query[key] === 'true') {
      query[key] = true;
    }
    if (key === 'priceRange') {
      query[key] = (query[key] as string)
        .split(',')
        .map((price: string) => parseInt(price, 10));
    }
    if (key === 'page') {
      query[key] = parseInt(query[key] as string, 10);
    }
  });

  console.log('query', query);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};

  if (query.searchTerm) {
    const searchTerm = query.searchTerm as string;
    const searchableFields = ['title', 'description', 'category', 'author'];
    filter.$or = searchableFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    }));
  }

  if (query.category) {
    filter.category = query.category as string;
  }

  if (query.author) {
    filter.author = query.author;
  }

  if (query.availability !== undefined) {
    filter.stock = { $gt: 0 };
  }

  if (query.priceRange) {
    const priceRange = query.priceRange as [number, number];
    filter.price = { $gte: priceRange[0], $lte: priceRange[1] };
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;

  const skip = (page - 1) * limit;

  const allBooks = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .populate('author');

  const total = await Product.countDocuments(filter);
  const totalPage = Math.ceil(total / limit);

  const meta = {
    total,
    page,
    limit,
    totalPage,
  };
  return {
    meta: meta,
    data: allBooks,
  };
};

export const ProductService = {
  createProduct,
  updateBook,
  GetProductById,
  deleteProduct,
  getAllProducts,
  getAllProductsForUser,
};
