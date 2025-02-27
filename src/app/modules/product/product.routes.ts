import express, { NextFunction, Request, Response } from 'express';

import ValidateUserRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-product',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    console.log('req.body.data', req.body.data);
    console.log('req.file', req.file);
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin),
  ValidateUserRequest(ProductValidation.createProductValidation),
  ProductController.createProduct,
);

router.get(
  '/get-product/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  ProductController.getProductById,
);

router.delete(
  '/delete-product/:id',
  auth(USER_ROLE.admin),
  ProductController.deleteProduct,
);

router.put(
  '/update-product/:id',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    console.log('req.body.data', req.body.data);
    console.log('req.file', req.file);
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin),
  ValidateUserRequest(ProductValidation.updateProductValidation),
  ProductController.updateProduct,
);

router.get('/get-all-products', ProductController.getAllProducts);

router.get('/all-products', ProductController.getAllProductsForUser);

export const ProductRoutes = router;
