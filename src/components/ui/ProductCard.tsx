import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { formatNumber } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import Button, { buttonClasses } from "./Button";
import Card from "./Card";
import Chip from "./Chip";
import { SkeletonCard } from "./Skeleton";

export type ProductCardLabels = {
  /** "From" / "শুরু" */
  from: string;
  /** "Order via Chat" */
  orderViaChat: string;
  /** "Out of stock" */
  outOfStock: string;
  /** Announced while loading */
  loading: string;
};

export type ProductCardProps = {
  product?: Product;
  locale: Locale;
  labels: ProductCardLabels;
  /** Where "Order via Chat" goes. */
  chatHref: string;
  /** Product page. When set, the image and name link to it. */
  href?: string;
  loading?: boolean;
  className?: string;
};

export default function ProductCard({
  product,
  locale,
  labels,
  chatHref,
  href,
  loading = false,
  className = "",
}: ProductCardProps) {
  if (loading || !product) {
    return <SkeletonCard loadingLabel={labels.loading} className={className} />;
  }

  const isBn = locale === "bn";
  const name = isBn ? product.name_bn : product.name_en;
  const category = isBn ? product.category_name_bn : product.category_name_en;
  const alt =
    (isBn ? product.image_alt_bn : product.image_alt_en) || name;
  const soldOut = product.stock_status === "out_of_stock";

  const image = (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[linear-gradient(135deg,rgba(255,93,115,0.12),rgba(56,189,248,0.16))]">
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
          className={`object-cover ${soldOut ? "opacity-60 grayscale" : ""}`}
        />
      ) : null}
    </div>
  );

  return (
    <Card className={`flex h-full flex-col overflow-hidden ${className}`.trim()}>
      {href ? (
        <Link href={href} className="ui-focus block" tabIndex={-1} aria-hidden>
          {image}
        </Link>
      ) : (
        image
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-2">
          <Chip color="violet">{category}</Chip>
          {soldOut ? <Chip color="neutral">{labels.outOfStock}</Chip> : null}
        </div>
        <h3 className="text-xl font-bold">
          {href ? (
            <Link href={href} className="ui-focus underline-offset-4 hover:underline">
              {name}
            </Link>
          ) : (
            name
          )}
        </h3>
        <p className="text-lg font-semibold">
          {labels.from} ৳{formatNumber(product.base_price, locale)}
        </p>
        <div className="mt-auto pt-2">
          {soldOut ? (
            <Button disabled className="w-full">
              {labels.outOfStock}
            </Button>
          ) : (
            <Link href={chatHref} className={buttonClasses({ className: "w-full" })}>
              <MessageCircle aria-hidden className="size-5" />
              {labels.orderViaChat}
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
