export interface IProduct {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
  isDeleted?: boolean;
}
