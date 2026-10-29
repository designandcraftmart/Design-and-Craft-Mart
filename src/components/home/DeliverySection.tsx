import Link from "next/link";
import { MapPin, Truck, Wallet } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import SectionHeading from "@/components/ui/SectionHeading";
import { getDictionary } from "@/lib/dictionaries";

export default async function DeliverySection() {
  const { locale, dict } = await getDictionary();
  const d = dict.home.delivery;

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:py-16">
      <SectionHeading title={d.title} subtitle={d.subtitle} />

      <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-6">
        <Card lift={false} className="flex gap-4 p-6">
          <span
            aria-hidden
            className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-lagoon"
          >
            <MapPin className="size-7 text-ink" strokeWidth={1.75} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold">{d.chittagongTitle}</h3>
              <Chip color="teal">{d.chittagongBadge}</Chip>
            </div>
            <p className="mt-1 text-lg">{d.chittagongBody}</p>
          </div>
        </Card>

        <Card lift={false} className="flex gap-4 p-6">
          <span
            aria-hidden
            className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-sunset"
          >
            <Truck className="size-7 text-ink" strokeWidth={1.75} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold">{d.bangladeshTitle}</h3>
              <Chip color="amber">{d.bangladeshBadge}</Chip>
            </div>
            <p className="mt-1 text-lg">{d.bangladeshBody}</p>
          </div>
        </Card>
      </div>

      <Card
        lift={false}
        className="mt-4 flex flex-col gap-4 bg-[linear-gradient(135deg,rgba(255,176,32,0.16),rgba(255,93,115,0.12))] p-6 sm:flex-row sm:items-center lg:mt-6"
      >
        <span
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-candy"
        >
          <Wallet className="size-7 text-white" strokeWidth={1.75} />
        </span>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{d.paymentTitle}</h3>
          <p className="mt-1 text-lg">{d.paymentBody}</p>
        </div>
        <Link
          href={`/${locale}/delivery-payment`}
          className={buttonClasses({ variant: "secondary" })}
        >
          {d.readMore}
        </Link>
      </Card>
    </section>
  );
}