import Link from "next/link";
import { Coffee, Frame, Gift, Heart, Shirt } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";

export default async function HomePage() {
  const { locale, dict } = await getDictionary();
  const base = `/${locale}`;

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(60%_80%_at_0%_0%,rgba(255,93,115,0.16),transparent),radial-gradient(50%_70%_at_100%_10%,rgba(56,189,248,0.2),transparent),radial-gradient(60%_60%_at_80%_100%,rgba(255,176,32,0.2),transparent)]">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <h1 className="text-[32px] font-extrabold text-balance sm:text-5xl lg:text-[56px]">
            {dict.hero.title}
          </h1>
          <p className="mt-4 max-w-[34rem] text-lg text-ink">
            {dict.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`${base}/shop`}
              className="inline-flex min-h-12 items-center justify-center rounded-pill bg-sunset px-7 text-lg font-bold text-ink shadow-soft transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
            >
              {dict.hero.browse}
            </Link>
            <Link
              href={`${base}/chat`}
              className="inline-flex min-h-12 items-center justify-center rounded-pill border-2 border-coral bg-white px-7 text-lg font-bold text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
            >
              {dict.hero.orderChat}
            </Link>
          </div>
        </div>

        {/* Decorative collage of tilted gift "frames". Purely visual. */}
        <div
          aria-hidden
          className="relative mx-auto h-64 w-full max-w-sm sm:h-80 lg:h-96"
        >
          <div className="absolute top-2 left-2 flex size-36 -rotate-6 items-center justify-center rounded-card bg-candy shadow-soft sm:size-44">
            <Frame className="size-16 text-white sm:size-20" strokeWidth={1.5} />
          </div>
          <div className="absolute top-0 right-0 flex size-28 rotate-6 items-center justify-center rounded-card bg-lagoon shadow-soft sm:size-36">
            <Coffee className="size-12 text-white sm:size-16" strokeWidth={1.5} />
          </div>
          <div className="absolute right-6 bottom-4 flex size-36 rotate-3 items-center justify-center rounded-card bg-sunset shadow-soft sm:size-44">
            <Shirt className="size-16 text-ink sm:size-20" strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-2 left-4 flex size-24 -rotate-12 items-center justify-center rounded-card border-2 border-white bg-white/70 shadow-soft sm:size-28">
            <Gift className="size-10 text-violet sm:size-12" strokeWidth={1.5} />
          </div>
          <Heart
            className="absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-1/2 fill-coral text-coral"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </section>
  );
}
