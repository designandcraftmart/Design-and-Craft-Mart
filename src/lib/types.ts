/** Product shape used by ProductCard. Mirrors the products table in the data model. */
export type Product = {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string;
  category_name_en: string;
  category_name_bn: string;
  /** Starting price in BDT. */
  base_price: number;
  /** First product image (full URL or a path under /public). Null shows a placeholder. */
  image_url: string | null;
  image_alt_en?: string;
  image_alt_bn?: string;
  stock_status: "in_stock" | "out_of_stock";
};
