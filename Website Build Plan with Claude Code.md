# Website Build Plan with Claude Code

A step-by-step plan for building a website with Claude Code, adapted from the "Build an AI Agent in 10 Minutes" guide. Steps 1 to 5 are used; step 6 is optional and comes later.

## Step 0: Plan before any code

Write these down first. Claude builds much better when it has them.

- **Goal of the site:** what should a visitor do (browse, order, message you)?
- **Pages:** for example Home, Products, About, Contact.
- **Content:** text for each page, product list, prices.
- **Photos and logo:** collected in one folder.
- **Languages:** English, Bangla, or both.
- **Contact and ordering method:** WhatsApp, Facebook, phone, form.

## Step 1: Set up your tools

1. Install **Claude Code** as the VS Code extension or in the terminal, so you can see files and a live preview.
2. Install **Git** and **Node.js**.
3. Create a **GitHub repository** for the project.
4. Create the project folder and open it in VS Code.

## Step 2: Write CLAUDE.md (project context)

Put `CLAUDE.md` in the **project root**, not in `~/`. Claude reads it at the start of every session.

Include these sections:

- **Role:** "You are a web developer and designer building this site for me."
- **Brand:** name, audience, what you sell.
- **Tech stack:** plain HTML/CSS/JS, or Next.js, or similar.
- **Design rules:** colors, fonts, spacing, logo usage.
- **Voice:** tone and wording for page text.
- **Languages:** which ones, and how switching works.
- **Always:** mobile-first, fast loading, accessible, commit after each change.
- **Never:** placeholder text, new libraries without asking, deleting files without asking.

Prompt to paste:

> Help me build a CLAUDE.md for my website project. Ask me about the business, audience, languages, tech stack, design rules, tone of voice, and things you must never do. Save the final file in the project root as CLAUDE.md.

## Step 3: Memory

Keep it simple. Rules and corrections go into `CLAUDE.md` so they apply to the whole project and travel with the repo.

Prompt to paste:

> From now on, whenever I correct you, add the correction as a short rule under a "Lessons learned" section in CLAUDE.md.

## Step 4: Skills (repeatable commands)

Turn repeated jobs into one-line commands. Good starting set:

- `/new-page`: create a page using the site's layout and style.
- `/add-product`: add a product with name, price, photo, description.
- `/seo-check`: review titles, descriptions, headings, alt text.
- `/deploy`: commit, push, and confirm the live site updated.

Connect **GitHub** (not Gmail or Notion) as the main tool.

Prompt to paste:

> Turn this workflow into a /{name} skill: \[describe trigger, inputs, outputs\]. Create .claude/skills/{name}/SKILL.md in this project and make it usable from any chat.

## Step 5: Agents (specialist roles)

Each agent is one file with one job, stored in `.claude/agents/`.

| Agent | Job | Model |
| --- | --- | --- |
| **Designer** | Layout, copy, and visual choices following CLAUDE.md | Opus |
| **Builder** | Writes the code for the pages | Sonnet |
| **QA** | Checks the work against the list below; fails anything that misses | Sonnet |

**QA checklist** (use this instead of a vague "95/100" score):

- Layout works on phone, tablet, and desktop.
- No broken links or missing images.
- Images are compressed and load fast.
- Text is readable (contrast, font size) and every image has alt text.
- Both languages display correctly, if used.
- Lighthouse scores of 90 or higher for performance and accessibility.

Prompt to paste:

> Build me an agent team for creating this website: Designer, Builder, and QA. Create one .md file per agent in .claude/agents/. Use Opus for the Designer and Sonnet for the Builder and QA. QA must check the list in CLAUDE.md and fail any work that does not pass.

## Step 6: Autopilot (optional, later)

Skip this while building. After launch it can run recurring jobs such as a weekly broken-link check or speed test. Check Anthropic's documentation first, because scheduling features change quickly.

## Hosting and launch

- **Hosting:** Vercel, Netlify, Cloudflare Pages, or GitHub Pages. All deploy from your repo, usually for free.
- **Domain:** buy one if you want your own address, and connect it in the host's settings.
- **Business email:** optional, set up through the domain provider.
- **Commit often:** every working change gets a commit, so anything Claude breaks can be undone.

## Suggested order of work

1. Finish Step 0 (plan and content).
2. Set up tools and the repo (Step 1).
3. Create CLAUDE.md (Step 2).
4. Build the home page, review it, then add the other pages one at a time.
5. Add skills and agents as you notice repeated work (Steps 4 and 5).
6. Run the QA checklist, fix issues, then deploy.
7. Check the live site on a real phone.
