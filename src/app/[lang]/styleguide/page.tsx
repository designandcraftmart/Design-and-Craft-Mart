import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/Skeleton";
import { getDictionary } from "@/lib/dictionaries";
import type { Product } from "@/lib/types";
import { ButtonDemo, FormDemo, ModalDemo, ToastDemo } from "./Demos";

// Internal reference page: kept out of search results and out of the nav.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function StyleguidePage() {
  const { locale, dict } = await getDictionary();
  const s = dict.styleguide;
  const u = dict.ui;

  const products: Product[] = [
    {
      id: "sample-1",
      slug: "sample-frame",
      name_en: "Heart Photo Calendar Frame",
      name_bn: "হার্ট ফটো ক্যালেন্ডার ফ্রেম",
      category_name_en: "Photo Frames",
      category_name_bn: "ফটো ফ্রেম",
      base_price: 450,
      image_url: "/styleguide/sample-frame.webp",
      image_alt_en: "Sample photo frame with a heart",
      image_alt_bn: "হার্টসহ নমুনা ফটো ফ্রেম",
      stock_status: "in_stock",
    },
    {
      id: "sample-2",
      slug: "sample-mug",
      name_en: "Custom Photo Mug",
      name_bn: "কাস্টম ফটো মগ",
      category_name_en: "Mugs",
      category_name_bn: "মগ",
      base_price: 350,
      image_url: "/styleguide/sample-mug.webp",
      stock_status: "in_stock",
    },
    {
      id: "sample-3",
      slug: "sample-tshirt",
      name_en: "Personalized T-shirt",
      name_bn: "নিজের নামে টি-শার্ট",
      category_name_en: "T-shirts",
      category_name_bn: "টি-শার্ট",
      base_price: 550,
      image_url: "/styleguide/sample-tshirt.webp",
      stock_status: "out_of_stock",
    },
  ];

  const labels = {
    from: u.product.from,
    orderViaChat: u.product.orderViaChat,
    outOfStock: u.product.outOfStock,
    loading: u.loading,
  };
  const chatHref = `/${locale}/chat`;

  const block = "mt-12 lg:mt-16";

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:py-16">
      <SectionHeading as="h1" title={s.title} subtitle={s.intro} />

      <section className={block} aria-labelledby="sg-buttons">
        <h2 id="sg-buttons" className="mb-6 text-[26px] font-bold">
          {s.buttons}
        </h2>
        <ButtonDemo s={s} loadingText={u.loading} />
      </section>

      <section className={block} aria-labelledby="sg-cards">
        <h2 id="sg-cards" className="mb-6 text-[26px] font-bold">
          {s.cards}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-xl font-bold">{s.cardTitle}</h3>
            <p className="mt-2">{s.cardBody}</p>
          </Card>
          <Card lift={false} className="bg-[linear-gradient(135deg,rgba(255,93,115,0.12),rgba(255,176,32,0.14))] p-6">
            <h3 className="text-xl font-bold">{s.cardTitle}</h3>
            <p className="mt-2">{s.cardBody}</p>
          </Card>
        </div>
      </section>

      <section className={block} aria-labelledby="sg-chips">
        <h2 id="sg-chips" className="mb-6 text-[26px] font-bold">
          {s.chips}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Chip color="coral">{s.chipNew}</Chip>
          <Chip color="amber">{s.chipPopular}</Chip>
          <Chip color="teal">{s.chipFresh}</Chip>
          <Chip color="violet">{s.chipCustom}</Chip>
          <Chip color="sky">{s.chipGift}</Chip>
          <Chip color="neutral">{s.chipOut}</Chip>
        </div>
      </section>

      <section className={block} aria-labelledby="sg-forms">
        <h2 id="sg-forms" className="mb-6 text-[26px] font-bold">
          {s.forms}
        </h2>
        <FormDemo s={s} />
      </section>

      <section className={block} aria-labelledby="sg-modal">
        <h2 id="sg-modal" className="mb-6 text-[26px] font-bold">
          {s.modal}
        </h2>
        <ModalDemo s={s} closeLabel={u.close} />
      </section>

      <section className={block} aria-labelledby="sg-toasts">
        <h2 id="sg-toasts" className="mb-6 text-[26px] font-bold">
          {s.toasts}
        </h2>
        <ToastDemo s={s} />
      </section>

      <section className={block} aria-labelledby="sg-skeletons">
        <h2 id="sg-skeletons" className="mb-6 text-[26px] font-bold">
          {s.skeletons}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard loadingLabel={u.loading} />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <SkeletonText lines={4} />
          </div>
        </div>
      </section>

      <section className={block} aria-labelledby="sg-headings">
        <h2 id="sg-headings" className="mb-6 text-[26px] font-bold">
          {s.headings}
        </h2>
        <div className="grid gap-10">
          <SectionHeading title={s.headingTitle} subtitle={s.headingSub} />
          <SectionHeading as="h3" align="center" title={s.headingTitle} />
        </div>
      </section>

      <section className={block} aria-labelledby="sg-products">
        <h2 id="sg-products" className="mb-2 text-[26px] font-bold">
          {s.products}
        </h2>
        <p className="mb-6 text-soft-gray">{s.sampleNote}</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              labels={labels}
              chatHref={chatHref}
              href={`/${locale}/shop`}
            />
          ))}
          <ProductCard loading locale={locale} labels={labels} chatHref={chatHref} />
        </div>
      </section>

      <section className={block} aria-labelledby="sg-states">
        <h2 id="sg-states" className="mb-6 text-[26px] font-bold">
          {s.states}
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <EmptyState
            title={u.empty.title}
            description={u.empty.description}
            action={
              <Button size="lg">{s.emptyAction}</Button>
            }
          />
          <ErrorState
            title={u.error.title}
            description={u.error.description}
            action={
              <Button variant="secondary" size="lg">
                {u.tryAgain}
              </Button>
            }
          />
        </div>
      </section>
    </div>
  );
}
