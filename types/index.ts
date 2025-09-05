export interface ChildProps {
  children: React.ReactNode;
}

export type SearchParams = { [key: string]: string | string[] | undefined };
export type Params = {
  productId: string;
  product: {
    userId: {
      _id: string;
      email: string;
      fullName: string;
      phone1?: string | undefined;
    };
  };
};
export interface IProduct1 {
  title: string;
  category: string;
  price: number;
  image: string;
  description: string;
  imageKey: string;
  _id: string;
}
export interface QueryProps {
  params: string;
  key: string;
  value?: string | null;
}
export interface CartProps {
  productId: string;
  quantity: number;
  selleronId: string | undefined;
}
export interface CartProps1 {
  productId: ProductProps[];
  quantity: number;
  selleronId: string | undefined;
}
export interface ProductProps {
  productId: string;
  quantity: number;
  selleronId: string;
}
export interface OrdersProps {
  products: ProductProps[];
  latitude: string | undefined;
  longitude: string | undefined;
  isPaid: boolean;
  totalPrice: string;
}

export interface ReturnActionType {
  user: IUser;
  failure: string;
  checkoutUrl: string;
  status: number;
  isNext: boolean;
  products: IProduct[];
  product: IProduct;
  customers: IUser[];
  orders: IOrder[];
  transactions: ITransaction[];
  statistics: {
    totalOrders: number;
    totalTransactions: number;
    totalFavourites: number;
  };
  cart: {
    products: IProduct[];
  };
}
export interface OrdersResponse {
  orders: IOrder1[];
  isNext: boolean;
}
interface IOrderProduct {
  title: string;
  price: number;
  _id: string;
  image: string;
  imageKey: string;
  category: string;
  description: string;
}

export interface IOrder1 {
  _id: string;
  user: {
    fullName: string;
    email: string;
    phone1: string;
  };
  product: IOrderProduct;
  quantity: number;
  latitude: string;
  longitude: string;
  isPaid: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  productId: {
    _id: string;
    userId: object;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    imageKey: string;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  sellerId?: string;
  category: {
    _id: string;
    name: string;
    image: string;
    slug: string;
    subcategories: {
      _id: string;
      name: string;
      slug: string;
    };
  };
  price: number;
  image: string;
  imageKey: string;
  title: string;
  description: string;
  selleronId: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone1?: string | undefined;
  };
  _id: string;
}

export interface IUser {
  email: string;
  fullName: string;
  password: string;
  _id: string;
  role: string;
  name: string;
  orderCount: number;
  totalPrice: number;
  image: string;
  avatarKey: string;
  isDeleted: boolean;
  deletedAt: Date;
  phone: string;
  favorites: IProduct[];
}

export interface IOrder {
  _id: string;
  user: IUser;
  product: IProduct;
  createdAt: Date;
  price: number;
  status: string;
  updatedAt: Date;
}

export interface ITransaction {
  _id: string;
  id: string;
  user: IUser;
  product: IProduct;
  state: number;
  amount: number;
  create_time: number;
  perform_time: number;
  cancel_time: number;
  reason: number;
  provider: string;
}

export interface Subcategory {
  _id: string; // MongoDB ObjectId string sifatida
  name: string;
  slug: string;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
  subcategories: Subcategory[];
  __v: number;
}
