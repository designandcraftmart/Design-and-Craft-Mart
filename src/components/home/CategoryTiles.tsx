import Image from "next/image";
import Link from "next/link";
import { Coffee, Frame, Gift, Shirt, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { getCategories } from "@/lib/catalog";
import { getDictionary } from "@/lib/dictionaries";

// Presentation only: icon per known slug, Gift for any category added later.
const icons: Record<string, LucideIcon> = {
  "photo-frames": Frame,
  mugs: Coffee,
  "t-shirts": Shirt,
  "custom-gifts": Gift,
};

// Icon-circle looks rotate through the brand gradients.
const looks = [
  { bg: "bg-sunset", icon: "text-ink" },
  { bg: "bg-candy", icon: "text-white" },
  { bg: "bg-lagoon", icon: "text-ink" },
];

export default async function CategoryTiles() {
  const { locale, dict } = await getDictionary();
  const result = await getCategories();
  if (!result.ok || result.data.length === 0) return null;

  const base = `/${locale}`;
  const h = (dict as typeof dict & {
    home?: { categories?: { title: string; subtitle: string } };
  }).home?.categories ?? {
    title: locale === "bn" ? "ক্যাটাগরি অনুযায়ী কিনুন" : "Shop by category",
    subtitle:
      locale === "bn"
        ? "আপনার পছন্দের পণ্য খুঁজে নিন"
        : "Find something made just for you",
  };

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:py-16">
      <SectionHeading title={h.title} subtitle={h.subtitle} />
      <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {result.data.map((category, index) => {
          const look = looks[index % looks.length];
          const Icon = icons[category.slug] ?? Gift;
          const name = locale === "bn" ? category.name_bn : category.name_en;
          return (
            <li key={category.id}>
              <Link
                href={`${base}/products?category=${category.slug}`}
                className="ui-focus flex h-full flex-col items-center gap-3 rounded-card bg-white p-5 text-center shadow-soft active:scale-[0.97] motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-1"
              >
                <span
                  aria-hidden
                  className={`relative flex size-20 items-center justify-center overflow-hidden rounded-pill ${look.bg}`}
                >
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <Icon className={`size-9 ${look.icon}`} strokeWidth={1.75} />
                  )}
                </span>
                <span className="font-heading text-xl font-bold">{name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}