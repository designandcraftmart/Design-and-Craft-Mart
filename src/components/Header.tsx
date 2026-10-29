import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import LanguageToggle from "./LanguageToggle";
import NavLinks, { type NavItem } from "./NavLinks";

export default async function Header() {
  const { locale, dict } = await getDictionary();
  const base = `/${locale}`;

  const items: NavItem[] = [
    { href: base, label: dict.nav.home, exact: true },
    { href: `${base}/products`, label: dict.nav.shop },
    { href: `${base}/how-to-order`, label: dict.nav.howToOrder },
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20">
        <Link href={base} className="shrink-0" aria-label={dict.brand.name}>
          <Image
            src="/brand/dcm-logo.png"
            alt={dict.common.logoAlt}
            width={480}
            height={160}
            priority
            className="h-10 w-auto min-w-24 lg:h-12"
          />
        </Link>

        <NavLinks items={items} label={dict.common.mainNav} />

        <LanguageToggle locale={locale} label={dict.common.languageLabel} />
      </div>
      <div className="h-1 bg-[linear-gradient(90deg,#ff5d73,#ffb020,#14b8a6,#38bdf8,#7c4dff)]" />
    </header>
  );
}