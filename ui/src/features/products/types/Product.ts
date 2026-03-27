export interface Product {
  id: string;
  name: string;
  priceCents: number;
}

export interface CreateProductPayload {
  id?: string;
  name: string;
  priceCents: number;
}
