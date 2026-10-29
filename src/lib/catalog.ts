import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";
import type { Product } from "@/lib/types";

/** Cached reads never throw: the page decides how to show a failure. */
export type CatalogResult<T> = { ok: true; data: T } | { ok: false };

export type CategorySummary = {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string;
  image_url: string | null;
};

/**
 * Columns a product card needs. Visible product = is_active = true AND
 * stock_status <> 'hidden' (add those two filters to every public query).
 */
export const PRODUCT_CARD_SELECT =
  "id, slug, name_en, name_bn, base_price, stock_status, categories ( name_en, name_bn ), product_images ( url, alt_en, alt_bn, sort_order )";

type CardRow = {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string;
  base_price: number;
  stock_status: Database["public"]["Enums"]["stock_status"];
  categories: { name_en: string; name_bn: string } | null;
  product_images: {
    url: string;
    alt_en: string | null;
    alt_bn: string | null;
    sort_order: number;
  }[];
};

/** Database row -> the Product shape used by ProductCard. */
export function toProduct(row: CardRow): Product {
  const images = [...row.product_images].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const first = images[0];
  return {
    id: row.id,
    slug: row.slug,
    name_en: row.name_en,
    name_bn: row.name_bn,
    category_name_en: row.categories?.name_en ?? "",
    category_name_bn: row.categories?.name_bn ?? "",
    base_price: Number(row.base_price),
    image_url: first?.url ?? null,
    image_alt_en: first?.alt_en ?? undefined,
    image_alt_bn: first?.alt_bn ?? undefined,
    // made_to_order is orderable, so it shows as in stock on cards.
    stock_status: row.stock_status === "out_of_stock" ? "out_of_stock" : "in_stock",
  };
}

export async function getCategories(): Promise<CatalogResult<CategorySummary[]>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("categories");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name_en, name_bn, image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCategories failed:", error.message);
    return { ok: false };
  }
  return { ok: true, data };
}

export async function getFeaturedProducts(): Promise<CatalogResult<Product[]>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("is_active", true)
    .neq("stock_status", "hidden")
    .eq("is_featured", true)
    .order("created_at", { ascending: true })
    .limit(8);

  if (error) {
    console.error("getFeaturedProducts failed:", error.message);
    return { ok: false };
  }
  return { ok: true, data: data.map(toProduct) };
}