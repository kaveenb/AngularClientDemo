export interface ProductModel {
  name: string;
  description: string;
  sku: string;
  date_created: Date;
  units_in_stock: number;
  unit_price: number;
  last_updated: Date;
  active: boolean;
  image_url: string;
  id: number;
  category_id: number;
}
