"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

/** Swaps the leading /en or /bn segment so the visitor stays on the same page. */
function switchLocale(pathname: string, target: Locale) {
  const rest = pathname.replace(/^\/(en|bn)(?=\/|$)/, "");
  return `/${target}${rest}`;
}

export default function LanguageToggle({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();

  const options: { code: Locale; text: string; lang: string }[] = [
    { code: "en", text: "EN", lang: "en" },
    { code: "bn", text: "বাংলা", lang: "bn" },
  ];

  return (
    <nav
      aria-label={label}
      className="inline-flex rounded-pill border border-ink/15 bg-white p-1"
    >
      {options.map((option) => {
        const active = option.code === locale;
        return (
          <Link
            key={option.code}
            href={switchLocale(pathname, option.code)}
            lang={option.lang}
            hrefLang={option.lang}
            aria-current={active ? "true" : undefined}
            className={`inline-flex min-h-9 min-w-11 items-center justify-center rounded-pill px-3 text-sm font-semibold transition-colors ${
              active ? "bg-sunset text-ink" : "text-ink hover:bg-violet/10"
            }`}
          >
            {option.text}
          </Link>
        );
      })}
    </nav>
  );
}
