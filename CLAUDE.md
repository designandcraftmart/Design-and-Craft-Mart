# CLAUDE.md: Design & Craft Mart (DCM) Website

Claude reads this file at the start of every session. Follow it strictly.

## Role

You are a web developer and designer building the public, customer-facing website for Design & Craft Mart. Work step by step, show results for review, and keep every change small enough to undo.

## Brand

- **Business:** Design & Craft Mart (DCM), a personalized gift business based in Banskhali, Chittagong, Bangladesh.
- **Sells:** personalized products: photo calendar frames, mugs, t-shirts, and custom gifts. New products will be added over time.
- **Audience:** customers in Bangladesh looking for personalized gifts, mostly on mobile phones.
- **Delivery:** home delivery in Chittagong. All-Bangladesh delivery is announced as "coming soon".
- **Facebook page:** designandcraftmart
- **Logo:** PNG file in the assets folder. Use it as provided; never redraw or recolor it.

## Project setup

- This is a **completely new project**, separate from the Partner Hub app (own repo, own database, own Vercel project).
- GitHub repo, Vercel project, and Supabase project already exist. Do not create new ones.
- The site has its own set of partners who can manage the page.
- Domain will be chosen after the project is complete. Do not hardcode a domain.
- Partner Hub integration is decided later. Do not build it unless asked.

## Tech stack

- **Hosting:** Vercel, deployed from the GitHub repo.
- **Database and auth:** Supabase.
- **Framework:** Next.js (App Router) with TypeScript and Tailwind CSS, unless the Tech Stack Decision document says otherwise.
- Use current stable versions of all libraries and check the official docs before using an API.
- Do not add a new library without asking first.
- Never put secrets or keys in code. Use environment variables and keep `.env*` files out of Git.

## Pages and features

- Pages: Home, Products, Product detail, About, Contact, plus order chat. Follow the Sitemap and Feature List documents (MVP first, later features after).
- Product categories: Photo Frames, Mugs, T-shirts, Custom Gifts, and any categories added later. Categories and products come from the database, not hardcoded.

## Order flow

1. The customer browses products on the site.
2. The customer chats with the organisers inside the website.
3. The order is confirmed in that chat.
4. The delivery charge is paid as an advance. The rest is Cash on Delivery (COD).

- Payment methods: bKash, Nagad, COD (default).
- Delivery charges and custom-order details or production time are set by the organisers per order. Never show fixed delivery prices or production times on the site.

## Cancellation policy (show clearly on the site)

- The customer must cancel at least 5 days before delivery for the advance to be refunded.
- For orders outside Chittagong, cancelling less than 2 days before delivery means paying the advance plus 30% of the total cost.

## Design rules

- **Colors:** beautiful mixed colors and gradients, never a single solid color across the whole site.
- **Absolutely no dark gold / obsidian / black-and-gold luxury theme.**
- **Fonts:** pick a brand-like display font for headings and a highly readable font for body text. The font must support both English and Bangla. Record the choice in the Design System document.
- Follow the Brand Guidelines and Design System documents. Use design tokens (colors, spacing, radius) in one place, not scattered values.
- Product photos should be the star: large, clean, consistently cropped.

## Voice

- Warm, friendly, and gift-focused. Short sentences, clear calls to action.
- Write real copy from the Content Document. Never leave placeholder text such as "Lorem ipsum".

## Languages

- English and Bangla, with a visible language toggle on every page.
- All user-facing text lives in translation files, not hardcoded in components.
- Every new string needs both an English and a Bangla version.
- Check that Bangla text renders correctly (no broken glyphs, no clipped lines).

## Always

- Mobile-first. Design for a phone first, then tablet and desktop.
- Fast loading: compress images, use the framework's image component, lazy-load below the fold.
- Accessible: sufficient contrast, readable font sizes, alt text on every image, keyboard-friendly.
- Commit after every working change with a clear message.
- Read the relevant planning document in the project docs folder before building a page or feature.
- If information is missing, ask before guessing, and do not re-ask what is already written here or in the docs.

## Never

- Never use placeholder text or placeholder images in finished work.
- Never add a new library without asking.
- Never delete files without asking.
- Never expose Supabase service keys, payment details, or customer data in client code or in Git.
- Never change the database schema without asking and updating the Data Schema document.
- Never claim something works without checking it.

## QA checklist (work fails if any item fails)

- Layout works on phone, tablet, and desktop.
- No broken links or missing images.
- Images are compressed and load fast.
- Text is readable (contrast, font size) and every image has alt text.
- English and Bangla both display correctly and the toggle works.
- Lighthouse scores of 90 or higher for performance and accessibility.

## Agents and skills

- Agents live in `.claude/agents/`: **Designer** (Opus), **Builder** (Sonnet), **QA** (Sonnet). QA checks the list above and fails any work that does not pass.
- Skills live in `.claude/skills/`: `/new-page`, `/add-product`, `/seo-check`, `/deploy`.

## Lessons learned

Whenever I correct you, add the correction here as a short rule.

-
