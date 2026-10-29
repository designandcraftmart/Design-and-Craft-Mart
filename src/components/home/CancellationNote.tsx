import Link from "next/link";
import { Info } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getDictionary } from "@/lib/dictionaries";

export default async function CancellationNote() {
  const { locale, dict } = await getDictionary();
  const p = dict.policy;

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:py-12">
      <Card
        lift={false}
        className="flex flex-col gap-4 bg-[linear-gradient(135deg,rgba(255,93,115,0.1),rgba(124,77,255,0.1))] p-6 sm:flex-row sm:items-center"
      >
        <span
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-white text-violet shadow-soft"
        >
          <Info className="size-7" strokeWidth={1.75} />
        </span>
        <div className="flex-1">
          <h2 className="text-[26px] font-bold">{p.cancellationTitle}</h2>
          <p className="mt-1 text-lg">{p.cancellationText}</p>
        </div>
        <Link
          href={`/${locale}/cancellation-policy`}
          className={buttonClasses({ variant: "secondary" })}
        >
          {p.readMore}
        </Link>
      </Card>
    </section>
  );
}