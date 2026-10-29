import Link from "next/link";
import {
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import { getDictionary } from "@/lib/dictionaries";
import { formatNumber } from "@/lib/format";

const stepIcons: LucideIcon[] = [ShoppingBag, MessageCircle, Wallet, PackageCheck];
// Ink on the light gradients, white only on the large bold number over Candy.
const badges = [
  "bg-sunset text-ink",
  "bg-candy text-white",
  "bg-lagoon text-ink",
  "bg-sunset text-ink",
];

export default async function HowItWorks() {
  const { locale, dict } = await getDictionary();
  const h = dict.home.howItWorks;

  return (
    <div className="bg-[linear-gradient(135deg,rgba(124,77,255,0.08),rgba(56,189,248,0.14))]">
      <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:py-16">
        <SectionHeading title={h.title} subtitle={h.subtitle} />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {h.steps.map((text, index) => {
            const Icon = stepIcons[index];
            return (
              <li key={text}>
                <Card lift={false} className="h-full p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex size-11 items-center justify-center rounded-pill font-heading text-xl font-bold ${badges[index]}`}
                    >
                      {formatNumber(index + 1, locale)}
                    </span>
                    {Icon ? (
                      <Icon aria-hidden className="size-7 text-violet" strokeWidth={1.75} />
                    ) : null}
                  </div>
                  <p className="mt-4 text-lg font-semibold">{text}</p>
                </Card>
              </li>
            );
          })}
        </ol>
        <div className="mt-8">
          <Link
            href={`/${locale}/how-to-order`}
            className={buttonClasses({ variant: "secondary" })}
          >
            {h.learnMore}
          </Link>
        </div>
      </section>
    </div>
  );
}