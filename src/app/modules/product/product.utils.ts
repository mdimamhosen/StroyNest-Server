import { Product } from './product.model';

const findLastProductId = async () => {
  const lastProduct = await Product.findOne({}, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastProduct?.id ? lastProduct.id.substring(2) : undefined;
};

export const genarateProductId = async () => {
  let currentProductId = (0).toString().padStart(4, '0');
  const lastProductId = await findLastProductId();

  if (lastProductId) {
    currentProductId = (Number(lastProductId) + 1).toString().padStart(4, '0');
  } else {
    currentProductId = (1).toString().padStart(4, '0');
  }

  const productId = `P-${currentProductId}`;
  return productId;
};
