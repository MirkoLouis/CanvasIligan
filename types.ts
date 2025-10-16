export interface Store {
  name: string;
  address: string;
}

export interface Product {
  id: number;
  name: string;
  store: Store;
  category: string;
  price: number;
  description: string;
  mpn: string; // Manufacturer Part Number
  manufacturer: string;
  imageUrl?: string;
}