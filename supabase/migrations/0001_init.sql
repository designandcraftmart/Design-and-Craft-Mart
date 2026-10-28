-- =============================================================================
-- DCM (Design & Craft Mart) - 0001_init.sql
-- Schema, RLS, storage, business logic. Safe to re-run on a fresh project.
-- =============================================================================

-- ---------- ENUMS ------------------------------------------------------------
do $$ begin create type public.stock_status    as enum ('in_stock','out_of_stock','made_to_order','hidden'); exception when duplicate_object then null; end $$;
do $$ begin create type public.sender_type     as enum ('customer','organiser','system'); exception when duplicate_object then null; end $$;
do $$ begin create type public.order_status    as enum ('new_chat','awaiting_details','awaiting_advance','confirmed','in_production','ready','out_for_delivery','delivered','completed','cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type public.delivery_zone   as enum ('inside_ctg','outside_ctg'); exception when duplicate_object then null; end $$;
do $$ begin create type public.payment_method  as enum ('bkash','nagad','cod'); exception when duplicate_object then null; end $$;
do $$ begin create type public.payment_type    as enum ('advance','balance','refund'); exception when duplicate_object then null; end $$;
do $$ begin create type public.admin_role      as enum ('owner','admin','organiser'); exception when duplicate_object then null; end $$;
do $$ begin create type public.conversation_status as enum ('open','closed'); exception when duplicate_object then null; end $$;

-- ---------- GENERIC updated_at TRIGGER --------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- TABLES -----------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  slug        text not null unique,
  name_en     text not null,
  name_bn     text not null,
  image_url   text,
  sort_order  int not null default 0,
  is_active   boolean not null default true
);

create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  category_id  uuid not null references public.categories(id) on delete restrict,
  slug         text not null unique,
  name_en      text not null,
  name_bn      text not null,
  desc_en      text,
  desc_bn      text,
  base_price   numeric(12,2) not null default 0 check (base_price >= 0),
  is_custom    boolean not null default false,
  is_featured  boolean not null default false,
  stock_status public.stock_status not null default 'in_stock',
  tags         text[] not null default '{}',
  is_active    boolean not null default true
);

create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  product_id  uuid not null references public.products(id) on delete cascade,
  url         text not null,
  alt_en      text,
  alt_bn      text,
  sort_order  int not null default 0
);

create table if not exists public.product_options (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  product_id  uuid not null references public.products(id) on delete cascade,
  name_en     text not null,
  name_bn     text not null,
  -- e.g. [{"value_en":"M","value_bn":"এম","price_add":0}]
  values      jsonb not null default '[]'::jsonb
);

create table if not exists public.admin_profiles (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  name        text not null,
  role        public.admin_role not null default 'organiser',
  invited_by  uuid references public.admin_profiles(id) on delete set null,
  is_active   boolean not null default true
);

create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  name        text,
  phone       text,
  district    text,
  address     text
);

create table if not exists public.conversations (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  customer_id      uuid not null references public.customers(id) on delete cascade,
  product_id       uuid references public.products(id) on delete set null,
  status           public.conversation_status not null default 'open',
  assigned_to      uuid references public.admin_profiles(id) on delete set null,
  last_message_at  timestamptz not null default now()
);

create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  sender_type      public.sender_type not null,
  sender_id        uuid references auth.users(id) on delete set null,
  body             text,
  attachment_url   text,
  read_at          timestamptz,
  check (body is not null or attachment_url is not null)
);

create sequence if not exists public.order_no_seq start 1;

create table if not exists public.orders (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  order_no             text not null unique
                       default ('DCM-' || lpad(nextval('public.order_no_seq')::text, 4, '0')),
  conversation_id      uuid references public.conversations(id) on delete set null,
  customer_id          uuid not null references public.customers(id) on delete restrict,
  status               public.order_status not null default 'new_chat',
  items_total          numeric(12,2) not null default 0 check (items_total >= 0),
  delivery_charge      numeric(12,2) not null default 0 check (delivery_charge >= 0),
  advance_due          numeric(12,2) not null default 0 check (advance_due >= 0),
  advance_paid         numeric(12,2) not null default 0 check (advance_paid >= 0),
  cod_balance          numeric(12,2) not null default 0 check (cod_balance >= 0),
  delivery_zone        public.delivery_zone,
  address              text,
  delivery_date        date,
  cancel_requested_at  timestamptz,
  cancel_fee           numeric(12,2) check (cancel_fee >= 0),
  notes                text
);

create table if not exists public.order_items (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  product_id     uuid references public.products(id) on delete set null,
  name_snapshot  text not null,
  options        jsonb not null default '{}'::jsonb,
  qty            int not null default 1 check (qty > 0),
  unit_price     numeric(12,2) not null default 0 check (unit_price >= 0),
  custom_text    text,
  custom_files   text[] not null default '{}'
);

create table if not exists public.payments (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  method          public.payment_method not null,
  type            public.payment_type not null,
  amount          numeric(12,2) not null check (amount >= 0),
  trx_id          text,
  screenshot_url  text,
  verified_by     uuid references public.admin_profiles(id) on delete set null,
  verified_at     timestamptz
);

create table if not exists public.order_events (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  from_status  public.order_status,
  to_status    public.order_status not null,
  actor        uuid references auth.users(id) on delete set null,
  note         text
);

create table if not exists public.site_settings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  key         text not null unique,
  value       jsonb not null default 'null'::jsonb
);

-- ---------- updated_at triggers ---------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['categories','products','admin_profiles','customers','conversations','orders','site_settings']
  loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$s', t);
    execute format('create trigger trg_%1$s_updated_at before update on public.%1$s for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------- INDEXES ----------------------------------------------------------
create index if not exists idx_products_category_active on public.products (category_id, is_active);
create index if not exists idx_product_images_product   on public.product_images (product_id, sort_order);
create index if not exists idx_product_options_product  on public.product_options (product_id);
create index if not exists idx_admin_profiles_invited   on public.admin_profiles (invited_by);
create index if not exists idx_conversations_customer   on public.conversations (customer_id);
create index if not exists idx_conversations_product    on public.conversations (product_id);
create index if not exists idx_conversations_assigned   on public.conversations (assigned_to);
create index if not exists idx_conversations_last_msg   on public.conversations (last_message_at desc);
create index if not exists idx_messages_conv_created    on public.messages (conversation_id, created_at);
create index if not exists idx_orders_conversation      on public.orders (conversation_id);
create index if not exists idx_orders_customer          on public.orders (customer_id);
create index if not exists idx_orders_status_delivery   on public.orders (status, delivery_date);
create index if not exists idx_order_items_order        on public.order_items (order_id);
create index if not exists idx_order_items_product      on public.order_items (product_id);
create index if not exists idx_payments_order           on public.payments (order_id);
create index if not exists idx_payments_verified_by     on public.payments (verified_by);
create index if not exists idx_order_events_order       on public.order_events (order_id, created_at);

-- ---------- HELPER FUNCTIONS (security definer, stable) ---------------------
-- Anonymous (guest) sessions can never count as staff, even by mistake.
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_profiles ap
    where ap.user_id = auth.uid() and ap.is_active
  ) and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
$$;

create or replace function public.is_admin_or_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_profiles ap
    where ap.user_id = auth.uid() and ap.is_active and ap.role in ('admin','owner')
  ) and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
$$;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_profiles ap
    where ap.user_id = auth.uid() and ap.is_active and ap.role = 'owner'
  ) and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
$$;

-- The customers.id of the current guest (null if none). Used by policies.
create or replace function public.current_customer_id()
returns uuid language sql stable security definer set search_path = public as $$
  select c.id from public.customers c where c.user_id = auth.uid()
$$;

-- ---------- BUSINESS LOGIC ---------------------------------------------------
-- Cancellation fee (policy from the Content doc):
--   >= 5 days before delivery_date            -> 0 (advance refunded)
--   outside_ctg AND < 2 days before delivery  -> 30% of items_total (advance is kept)
--   anything else                             -> 0 (see Open Question 1 for the 2-5 day gap)
-- Staff can override by writing orders.cancel_fee directly and adding a note.
-- Runs as the caller, so RLS applies: guests get NULL (they cannot see staff-only logic on others' orders).
create or replace function public.compute_cancel_fee(p_order_id uuid, p_cancel_at timestamptz default now())
returns numeric language plpgsql stable as $$
declare
  o public.orders%rowtype;
  days_before int;
begin
  select * into o from public.orders where id = p_order_id;
  if not found or o.delivery_date is null then return null; end if;

  days_before := o.delivery_date - (p_cancel_at at time zone 'Asia/Dhaka')::date;

  if days_before >= 5 then
    return 0;
  elsif o.delivery_zone = 'outside_ctg' and days_before < 2 then
    return round(o.items_total * 0.30, 2);
  else
    return 0;
  end if;
end $$;

-- Keep conversations.last_message_at fresh (definer: guests cannot update conversations themselves).
create or replace function public.touch_conversation_on_message()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end $$;
drop trigger if exists trg_messages_touch_conversation on public.messages;
create trigger trg_messages_touch_conversation after insert on public.messages
  for each row execute function public.touch_conversation_on_message();

-- Log every order status change (and creation) into order_events.
create or replace function public.log_order_status_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.order_events (order_id, from_status, to_status, actor, note)
    values (new.id, null, new.status, auth.uid(), 'Order created');
  elsif new.status is distinct from old.status then
    insert into public.order_events (order_id, from_status, to_status, actor)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end $$;
drop trigger if exists trg_orders_log_status on public.orders;
create trigger trg_orders_log_status after insert or update of status on public.orders
  for each row execute function public.log_order_status_change();

-- ---------- ROW LEVEL SECURITY ----------------------------------------------
alter table public.categories      enable row level security;
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;
alter table public.product_options enable row level security;
alter table public.admin_profiles  enable row level security;
alter table public.customers       enable row level security;
alter table public.conversations   enable row level security;
alter table public.messages        enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;
alter table public.payments        enable row level security;
alter table public.order_events    enable row level security;
alter table public.site_settings   enable row level security;

-- categories
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories for select to anon, authenticated
  using (is_active);  -- Anyone can see active categories.
drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all on public.categories for all to authenticated
  using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());  -- Admins/owners manage all categories (incl. hidden).

-- products
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products for select to anon, authenticated
  using (is_active and stock_status <> 'hidden');  -- Anyone can see active, non-hidden products.
drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products for all to authenticated
  using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());  -- Admins/owners manage all products.

-- product_images
drop policy if exists product_images_public_read on public.product_images;
create policy product_images_public_read on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id));  -- Images are visible only if their product is visible to the viewer.
drop policy if exists product_images_admin_all on public.product_images;
create policy product_images_admin_all on public.product_images for all to authenticated
  using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());  -- Admins/owners manage product images.

-- product_options
drop policy if exists product_options_public_read on public.product_options;
create policy product_options_public_read on public.product_options for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id));  -- Options are visible only if their product is visible to the viewer.
drop policy if exists product_options_admin_all on public.product_options;
create policy product_options_admin_all on public.product_options for all to authenticated
  using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());  -- Admins/owners manage product options.

-- site_settings
drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon, authenticated
  using (true);  -- Contact/social settings are public (never store secrets here).
drop policy if exists site_settings_admin_all on public.site_settings;
create policy site_settings_admin_all on public.site_settings for all to authenticated
  using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());  -- Admins/owners edit site settings.

-- admin_profiles
drop policy if exists admin_profiles_self_read on public.admin_profiles;
create policy admin_profiles_self_read on public.admin_profiles for select to authenticated
  using (user_id = auth.uid());  -- A staff member can read their own profile (to load their role).
drop policy if exists admin_profiles_staff_read on public.admin_profiles;
create policy admin_profiles_staff_read on public.admin_profiles for select to authenticated
  using (public.is_staff());  -- Staff can see the team list (names/roles) for assignment.
drop policy if exists admin_profiles_owner_all on public.admin_profiles;
create policy admin_profiles_owner_all on public.admin_profiles for all to authenticated
  using (public.is_owner()) with check (public.is_owner());  -- Only the owner can invite, change or remove partners.

-- customers
drop policy if exists customers_self_select on public.customers;
create policy customers_self_select on public.customers for select to authenticated
  using (user_id = auth.uid());  -- A guest reads only their own customer row.
drop policy if exists customers_self_insert on public.customers;
create policy customers_self_insert on public.customers for insert to authenticated
  with check (user_id = auth.uid());  -- A guest can create only a row tied to their own auth id.
drop policy if exists customers_self_update on public.customers;
create policy customers_self_update on public.customers for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());  -- A guest edits only their own row and cannot re-assign it.
drop policy if exists customers_staff_all on public.customers;
create policy customers_staff_all on public.customers for all to authenticated
  using (public.is_staff()) with check (public.is_staff());  -- Staff can read and edit all customers.

-- conversations
drop policy if exists conversations_customer_select on public.conversations;
create policy conversations_customer_select on public.conversations for select to authenticated
  using (customer_id = public.current_customer_id());  -- A guest sees only their own conversations.
drop policy if exists conversations_customer_insert on public.conversations;
create policy conversations_customer_insert on public.conversations for insert to authenticated
  with check (customer_id = public.current_customer_id() and status = 'open' and assigned_to is null);  -- A guest opens conversations only for themselves, unassigned.
drop policy if exists conversations_staff_all on public.conversations;
create policy conversations_staff_all on public.conversations for all to authenticated
  using (public.is_staff()) with check (public.is_staff());  -- Staff manage every conversation.

-- messages
drop policy if exists messages_customer_select on public.messages;
create policy messages_customer_select on public.messages for select to authenticated
  using (exists (select 1 from public.conversations c
                 where c.id = conversation_id and c.customer_id = public.current_customer_id()));  -- A guest reads messages only in their own conversations.
drop policy if exists messages_customer_insert on public.messages;
create policy messages_customer_insert on public.messages for insert to authenticated
  with check (
    sender_type = 'customer' and sender_id = auth.uid() and read_at is null
    and exists (select 1 from public.conversations c
                where c.id = conversation_id and c.customer_id = public.current_customer_id())
  );  -- A guest posts only as "customer", as themselves, in their own conversation.
drop policy if exists messages_staff_all on public.messages;
create policy messages_staff_all on public.messages for all to authenticated
  using (public.is_staff()) with check (public.is_staff());  -- Staff read, reply, and mark messages read.

-- orders / order_items / payments (guests read-only, own data)
drop policy if exists orders_customer_select on public.orders;
create policy orders_customer_select on public.orders for select to authenticated
  using (customer_id = public.current_customer_id());  -- A guest sees only their own orders; no writes.
drop policy if exists orders_staff_all on public.orders;
create policy orders_staff_all on public.orders for all to authenticated
  using (public.is_staff()) with check (public.is_staff());  -- Staff create and update all orders.

drop policy if exists order_items_customer_select on public.order_items;
create policy order_items_customer_select on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o
                 where o.id = order_id and o.customer_id = public.current_customer_id()));  -- A guest sees items of their own orders only.
drop policy if exists order_items_staff_all on public.order_items;
create policy order_items_staff_all on public.order_items for all to authenticated
  using (public.is_staff()) with check (public.is_staff());  -- Staff manage all order items.

drop policy if exists payments_customer_select on public.payments;
create policy payments_customer_select on public.payments for select to authenticated
  using (exists (select 1 from public.orders o
                 where o.id = order_id and o.customer_id = public.current_customer_id()));  -- A guest sees payments of their own orders only.
drop policy if exists payments_staff_all on public.payments;
create policy payments_staff_all on public.payments for all to authenticated
  using (public.is_staff()) with check (public.is_staff());  -- Staff record and verify all payments.

-- order_events (internal audit log)
drop policy if exists order_events_staff_all on public.order_events;
create policy order_events_staff_all on public.order_events for all to authenticated
  using (public.is_staff()) with check (public.is_staff());  -- The status log is staff-only; guests have no access.

-- ---------- REALTIME ---------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['messages','conversations']
  loop
    if not exists (select 1 from pg_publication_tables
                   where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ---------- STORAGE ----------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('product-images',   'product-images',   true,  5242880, array['image/jpeg','image/png','image/webp','image/gif']),
  ('chat-attachments', 'chat-attachments', false, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- product-images: public read, staff write
drop policy if exists "product_images_obj_read" on storage.objects;
create policy "product_images_obj_read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');  -- Anyone can view product photos.
drop policy if exists "product_images_obj_staff_write" on storage.objects;
create policy "product_images_obj_staff_write" on storage.objects for all to authenticated
  using (bucket_id = 'product-images' and public.is_staff())
  with check (bucket_id = 'product-images' and public.is_staff());  -- Only staff upload, replace or delete product photos.

-- chat-attachments: private, one folder per guest (folder name = auth.uid())
drop policy if exists "chat_obj_customer_insert" on storage.objects;
create policy "chat_obj_customer_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'chat-attachments' and (storage.foldername(name))[1] = auth.uid()::text);  -- A guest uploads only into their own folder.
drop policy if exists "chat_obj_customer_select" on storage.objects;
create policy "chat_obj_customer_select" on storage.objects for select to authenticated
  using (bucket_id = 'chat-attachments' and (storage.foldername(name))[1] = auth.uid()::text);  -- A guest reads only files in their own folder.
drop policy if exists "chat_obj_staff_all" on storage.objects;
create policy "chat_obj_staff_all" on storage.objects for all to authenticated
  using (bucket_id = 'chat-attachments' and public.is_staff())
  with check (bucket_id = 'chat-attachments' and public.is_staff());  -- Staff read every chat file and can attach files in replies.
