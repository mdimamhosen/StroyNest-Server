import catchAsyncResponse from '../../utils/catchAsyncResponse';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';

const createProduct = catchAsyncResponse(async (req, res) => {
  const result = await ProductService.createProduct(req.body);

  const data = {
    success: true,
    statusCode: 201,
    message: 'Product created successfully',
    data: result,
  };
  sendResponse(res, data);
});

const getProductById = catchAsyncResponse(async (req, res) => {
  const result = await ProductService.GetProductById(req.params.id);
  const data = {
    success: true,
    statusCode: 200,
    message: 'Product fetched successfully',
    data: result,
  };
  sendResponse(res, data);
});

const deleteProduct = catchAsyncResponse(async (req, res) => {
  const result = await ProductService.deleteProduct(req.params.id);
  const data = {
    success: true,
    statusCode: 200,
    message: 'Product deleted successfully',
    data: result,
  };
  sendResponse(res, data);
});

const updateProduct = catchAsyncResponse(async (req, res) => {
  let file = null;
  if (req.file) {
    file = req.file;
  }
  const result = await ProductService.updateBook(req.params.id, req.body, file);
  const data = {
    success: true,
    statusCode: 200,
    message: 'Product updated successfully',
    data: result,
  };
  sendResponse(res, data);
});

const getAllProducts = catchAsyncResponse(async (req, res) => {
  const result = await ProductService.getAllProducts(req.query);
  const data = {
    success: true,
    statusCode: 200,
    message: 'Products fetched successfully',
    data: {
      data: result.data,
      meta: result.meta,
    },
  };
  sendResponse(res, data);
});

const getAllProductsForUser = catchAsyncResponse(async (req, res) => {
  const result = await ProductService.getAllProductsForUser(req.query);
  const data = {
    success: true,
    statusCode: 200,
    message: 'Products fetched successfully',
    data: {
      data: result.data,
      meta: result.meta,
    },
  };
  sendResponse(res, data);
});

export const ProductController = {
  createProduct,
  getProductById,
  deleteProduct,
  getAllProducts,
  updateProduct,
  getAllProductsForUser,
};
