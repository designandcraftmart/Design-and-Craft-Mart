import {
  BadgeCheck,
  MessageCircleHeart,
  Sparkles,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";

// Same pastel tint + dark text pairs as Chip (all 5.9:1 or better).
const items: { Icon: LucideIcon; tint: string }[] = [
  { Icon: Sparkles, tint: "bg-coral/15 text-[#9f1f35]" },
  { Icon: BadgeCheck, tint: "bg-amber/15 text-[#7a4b00]" },
  { Icon: Truck, tint: "bg-teal/15 text-[#0b5e56]" },
  { Icon: MessageCircleHeart, tint: "bg-violet/15 text-[#4b23b8]" },
];

export default async function TrustStrip() {
  const { dict } = await getDictionary();
  const t = dict.home.trust;

  return (
    <section
      aria-label={t.label}
      className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:py-12"
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {t.items.map((text, index) => {
          const item = items[index];
          return (
            <li
              key={text}
              className="flex items-center gap-3 rounded-card bg-white p-4 shadow-soft"
            >
              {item ? (
                <span
                  aria-hidden
                  className={`flex size-11 shrink-0 items-center justify-center rounded-pill ${item.tint}`}
                >
                  <item.Icon className="size-5" strokeWidth={1.75} />
                </span>
              ) : null}
              <span className="font-semibold">{text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}