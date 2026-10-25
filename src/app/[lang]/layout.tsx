import type { Metadata, Viewport } from "next";
import { Baloo_Da_2, Hind_Siliguri } from "next/font/google";
import "../globals.css";
import BottomNav from "@/components/BottomNav";
import FloatingChatButton from "@/components/FloatingChatButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getDictionary } from "@/lib/dictionaries";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";

const baloo = Baloo_Da_2({
  variable: "--font-baloo",
  subsets: ["latin", "bengali"],
  display: "swap",
});

const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF8F0",
};

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    metadataBase: new URL(site.url),
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[lang]">) {
  const { locale, dict } = await getDictionary();

  return (
    <html lang={locale} className={`${baloo.variable} ${hind.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-pill focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:shadow-soft"
        >
          {dict.common.skipToContent}
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingChatButton />
        <BottomNav
          locale={locale}
          labels={{
            home: dict.nav.home,
            shop: dict.nav.shop,
            chat: dict.nav.chat,
            menu: dict.nav.menu,
            howToOrder: dict.nav.howToOrder,
            about: dict.nav.about,
            contact: dict.nav.contact,
            close: dict.common.close,
            navLabel: dict.common.mobileNav,
            languageLabel: dict.common.languageLabel,
          }}
        />
      </body>
    </html>
  );
}
