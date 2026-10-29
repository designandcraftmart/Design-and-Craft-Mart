import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";

export type ComingSoonPage =
  | "shop"
  | "howToOrder"
  | "about"
  | "contact"
  | "chat"
  | "deliveryPayment"
  | "cancellationPolicy";

/**
 * Temporary page body so every header, footer and bottom-nav link works.
 * Each route gets its real page in a later task and stops using this.
 */
export default async function ComingSoon({ page }: { page: ComingSoonPage }) {
  const { locale, dict } = await getDictionary();

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-[32px] font-extrabold lg:text-[56px]">
        {dict.nav[page]}
      </h1>
      <p className="mt-4 text-lg">{dict.placeholder.comingSoon}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-pill border-2 border-coral bg-white px-7 text-lg font-bold transition-transform active:scale-[0.97]"
      >
        {dict.placeholder.backHome}
      </Link>
    </section>
  );
}