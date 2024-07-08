export interface ISale {
  id: number;
  transaction_date?: string;
  invoice_id: string;
  customer_name: string;
  total_price: number;
  detail: {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

export interface Products {
  id: number;
  name?: string;
  total_price: number;
  description: string;
}
export interface IRow {
  product_id?: number;
  name?: string;
  price?: number;
  total?: number;
  qty?: number;
}

export interface DataItem {
  id: number;
  name: string;
  price: number;
}

// Detail
export interface IDetail {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface DetailData {
  id: number;
  transaction_date: string;
  invoice_id: string;
  customer_name: string;
  tax: string;
  discount: string;
  subtotal: number;
  total_price: number;
  detail: IDetail[];
}

export interface IPayload {
  invoice_id: string;
  customer_name: string;
  tax: string;
  subtotal: number | undefined;
  discount: string;
  total_price: number | undefined;
  detail: {
    product_id: number;
    price: number;
    quantity: number;
  }[];
}