# Design and Craft Mart website

A customer website and a partner admin dashboard, sharing one Supabase database.

```
index.html                     customer website (menu pages, order form, chat)
admin/index.html               partner admin (sign in, requests, customers, sync, team)
config.js                      your Supabase address and publishable key
supabase/schema.sql            database tables and security rules
supabase/functions/chat        chat bot that answers customer questions (Claude)
supabase/functions/sync-partner   sends accepted orders to the partners website
supabase/functions/invite-partner founder invites partners by email
```

Customers never sign in. Partners sign in at `/admin/`, by invitation only.

## Setup (do these in order)

**1. Upload the files to GitHub.**
Open the repo, press Add file > Upload files, drag in everything from this folder (keep the folders), and press Commit.

**2. Create the database tables.**
Supabase > SQL Editor > New query. Paste the whole of `supabase/schema.sql` and press Run. Run it only once.

**3. Stop strangers from signing up.**
Supabase > Authentication > Sign In / Providers > Email. Turn OFF "Allow new users to sign up". (Invites still work.)

**4. Add your publishable key.**
Supabase > Project Settings > API Keys. Copy the **Publishable key** and paste it into `config.js` in place of `PASTE_YOUR_PUBLISHABLE_KEY_HERE`. Never paste a secret or service_role key into any file.

**5. Create your own founder account.**
Supabase > Authentication > Users > Add user > Create new user. Enter your email and a password, and tick "Auto Confirm User". Then go to SQL Editor and run this (use your email):

```sql
insert into profiles (id, full_name, role)
select id, 'Aias Hossain', 'founder' from auth.users where email = 'YOUR_EMAIL_HERE';
```

**6. Publish the three functions.**
Supabase > Edge Functions > Deploy a new function > Via Editor. Make one function for each folder in `supabase/functions` (names must be exactly `chat`, `sync-partner`, `invite-partner`). Paste the code from its `index.ts`. For each one, switch OFF "Verify JWT" (the functions check logins themselves), then Deploy.

Then Edge Functions > Secrets, and add:

| Secret | Value |
|---|---|
| `ANTHROPIC_API_KEY` | your Claude API key (console.anthropic.com) |
| `SITE_URL` | the address of your admin page, e.g. `https://yoursite.com/admin/` |
| `PARTNER_API_URL` | the partners website address that receives orders (add when ready) |
| `PARTNER_API_KEY` | the secret key that partners endpoint expects (add when ready) |

**7. Put the website online.**
Easiest: Vercel (vercel.com) > Add New > Project > import this GitHub repo > Deploy. No settings needed.

**8. Tell Supabase your website address.**
Supabase > Authentication > URL Configuration. Set Site URL to your website address, and add `https://yoursite.com/admin/` under Redirect URLs.

## Test it
1. Open the website, send an order from the Order form. 
2. Open `/admin/`, sign in, and you should see the request in Requests inbox.
3. Open it, enter price, advance and deadline, press Accept. 
4. Sync status shows "Not sent" until the partners website address is set (step 6). That is expected.
5. Team and roles > invite a partner. They get an email to set a password.

## Not built yet
Live chats, Products manager, Bot settings, Message templates, Notifications and Reports are still design only. Until the Products manager exists, edit products and the bot's FAQ in Supabase > Table Editor (`products`, `bot_settings`).

## Partners website
`sync-partner` sends this JSON (POST, header `x-api-key`) to `PARTNER_API_URL`:
`reference, type ("Lead" or "Order"), customer {name, phone}, product, details, price, advance, due, source`.
The partners website needs a small endpoint that checks the key and creates the Lead or Order.
