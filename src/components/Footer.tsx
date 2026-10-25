import { Mail, MessageCircle, Phone } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import { site } from "@/lib/site";

const linkClass =
  "inline-flex min-h-11 items-center gap-2 font-medium underline-offset-4 hover:underline";

export default async function Footer() {
  const { dict } = await getDictionary();
  const f = dict.footer;

  return (
    <footer className="mt-16 bg-[linear-gradient(135deg,rgba(255,93,115,0.12),rgba(255,176,32,0.12)_35%,rgba(56,189,248,0.12)_70%,rgba(124,77,255,0.12))]">
      <div className="h-1 bg-[linear-gradient(90deg,#ff5d73,#ffb020,#14b8a6,#38bdf8,#7c4dff)]" />
      {/* Extra bottom padding on mobile keeps content clear of the bottom nav. */}
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 pt-12 pb-12 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="font-heading text-2xl font-bold">{dict.brand.name}</p>
          <p className="mt-2 max-w-xs text-ink">{dict.brand.tagline}</p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-bold">{f.contactHeading}</h2>
          <ul className="mt-2">
            <li>
              <a href={site.phoneHref} className={linkClass}>
                <Phone aria-hidden className="size-4" />
                <span className="sr-only">{f.phone}: </span>
                <span dir="ltr">{site.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <MessageCircle aria-hidden className="size-4" />
                <span className="sr-only">{f.whatsapp}: </span>
                <span dir="ltr">{site.whatsappDisplay}</span>
              </a>
            </li>
            <li>
              <a href={site.emailHref} className={linkClass}>
                <Mail aria-hidden className="size-4" />
                <span className="sr-only">{f.email}: </span>
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-xl font-bold">{f.followHeading}</h2>
          <ul className="mt-2">
            <li>
              {site.facebookHref ? (
                <a
                  href={site.facebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {f.facebook}: {site.facebookName}
                </a>
              ) : (
                <span className="inline-flex min-h-11 items-center font-medium">
                  {f.facebook}: {site.facebookName}
                </span>
              )}
            </li>
            <li>
              <a
                href={site.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {f.instagram}: {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="border-t border-ink/10 px-4 py-4 pb-24 text-center text-sm text-ink lg:pb-4">
        {f.madeWithLove}
      </p>
    </footer>
  );
}
