
export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
}

export interface ProductFormData {
  name: string;
  price: string | number;
  description: string;
}
