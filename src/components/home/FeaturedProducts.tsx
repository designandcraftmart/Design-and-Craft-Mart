import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { getFeaturedProducts } from "@/lib/catalog";
import { getDictionary } from "@/lib/dictionaries";

export default async function FeaturedProducts() {
  const { locale, dict } = await getDictionary();
  const result = await getFeaturedProducts();

  // Nothing featured yet: skip the whole section instead of showing an empty block.
  if (result.ok && result.data.length === 0) return null;

  const base = `/${locale}`;
  const h = dict.home.featured;
  const labels = {
    from: dict.ui.product.from,
    orderViaChat: dict.ui.product.orderViaChat,
    outOfStock: dict.ui.product.outOfStock,
    loading: dict.ui.loading,
  };

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:py-16">
      <SectionHeading title={h.title} subtitle={h.subtitle} />
      <div className="mt-8">
        {result.ok ? (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {result.data.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  labels={labels}
                  href={`${base}/products/${product.slug}`}
                  chatHref={`${base}/chat?product=${encodeURIComponent(product.slug)}`}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href={`${base}/products`}
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                {h.viewAll}
              </Link>
            </div>
          </>
        ) : (
          <ErrorState
            title={dict.ui.error.title}
            description={dict.ui.error.description}
            action={
              <Link href={`${base}/chat`} className={buttonClasses({ size: "lg" })}>
                {dict.floatingChat.label}
              </Link>
            }
          />
        )}
      </div>
    </section>
  );
}