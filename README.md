# Design & Craft Mart (DCM) website

Standalone website for Design & Craft Mart, Banskhali, Chittagong.
Crafting Memories, Create Your Smile.

Stack: Next.js (App Router, TypeScript), Tailwind CSS v4, Supabase, Vercel.
Languages: English (`/en`) and Bangla (`/bn`).

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local     # then fill in the values (see below)
npm run dev                    # http://localhost:3000  (redirects to /en)
```

Other commands:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

## Environment variables

| Name | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page, the `anon` public key |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally, the Vercel URL in production |

Never put the `service_role` key in any `NEXT_PUBLIC_` variable or in client code.
`.env.local` is git-ignored.

## Deploy on Vercel

1. Push to GitHub. The Vercel project is already linked to this repo.
2. In Vercel > Project Settings > Environment Variables, add the three variables above.
3. Deploy. Keep the free `*.vercel.app` URL in `NEXT_PUBLIC_SITE_URL` until the domain is chosen.

## Project layout

```
public/brand/dcm-logo.png      PLACEHOLDER logo, replace with the real transparent PNG
src/proxy.ts                   redirects any path without /en or /bn to /en
src/dictionaries/en.json       English text
src/dictionaries/bn.json       Bangla text
src/lib/i18n.ts                locales and helpers
src/lib/dictionaries.ts        getDictionary() reads the locale from the /[lang] route
src/lib/site.ts                phone, WhatsApp, email and social links
src/lib/supabase/client.ts     Supabase client for Client Components
src/lib/supabase/server.ts     Supabase client for Server Components and actions
src/components/                Header, BottomNav, Footer, LanguageToggle, FloatingChatButton
src/components/ui/             Design system: Button, Card, Chip, Input, Textarea, Select, Modal,
                               Toast, Skeleton, SectionHeading, ProductCard, EmptyState, ErrorState
src/app/[lang]/styleguide/     /en/styleguide and /bn/styleguide: every component and variant (not in nav)
src/app/[lang]/layout.tsx      root layout (html lang, fonts, header, footer)
src/app/[lang]/page.tsx        Home (hero)
src/app/[lang]/*/page.tsx      temporary "coming soon" pages: shop, how-to-order, about, contact, chat
```

Design tokens (colors, gradients, radii, shadow, fonts) live in `src/app/globals.css`
and are available as Tailwind classes such as `bg-coral`, `bg-sunset`, `rounded-card`,
`rounded-pill`, `shadow-soft`.

## To do before launch

- Replace `public/brand/dcm-logo.png` with the real logo.
- Set `facebookHref` in `src/lib/site.ts` to the real Facebook page URL.
- No database tables exist yet. They arrive in the Database task.

## Notes for AI builders

- This Next.js version renames Middleware to Proxy (`src/proxy.ts`) and has Cache Components on.
  Read the matching guide in `node_modules/next/dist/docs/` before changing routing or caching.
- Add every new page under `src/app/[lang]/` and every new string to both JSON dictionaries.
