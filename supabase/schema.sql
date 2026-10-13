-- Design and Craft Mart: database setup
-- Paste this whole file into Supabase > SQL Editor > New query, then press Run.
-- It is safe to run once on a new project.

create sequence if not exists request_ref_seq start 1001;

-- Partners (one row per person who can sign in to the admin)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('founder','designer','packaging','advisor','advertising')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  source text not null default 'Direct',
  created_at timestamptz not null default now()
);
create index if not exists customers_phone_idx on customers(phone);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_note text not null default 'Custom quote',
  delivery_note text not null default 'Confirmed with price',
  active boolean not null default true,
  sort int not null default 0
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null default ('R-' || nextval('request_ref_seq')),
  customer_id uuid not null references customers(id) on delete cascade,
  product text not null,
  details text not null,
  source text not null default 'Direct',
  deadline_wanted date,
  status text not null default 'Pending' check (status in ('Pending','Accepted','Rejected','Changes asked')),
  price numeric,
  advance numeric,
  due date,
  decided_by uuid references profiles(id),
  sync_status text check (sync_status in ('Sent','Failed')),
  sync_target text not null default 'Lead' check (sync_target in ('Lead','Order')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists requests_status_idx on requests(status);
create index if not exists requests_created_idx on requests(created_at desc);

create table if not exists sync_log (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  target text not null,
  status text not null,
  response text,
  created_at timestamptz not null default now()
);

create table if not exists chat_sessions (
  id uuid primary key,
  created_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  sender text not null check (sender in ('customer','bot','partner')),
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_session_idx on chat_messages(session_id, created_at);

create table if not exists bot_settings (
  id int primary key default 1 check (id = 1),
  tone text not null default 'Friendly',
  handover_message text not null default 'Let me ask a partner to help you. They will reply here soon.',
  faq text not null default ''
);

-- Keep updated_at fresh
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists requests_updated on requests;
create trigger requests_updated before update on requests for each row execute function set_updated_at();

-- Who is the signed-in partner? (null if not an active partner)
create or replace function my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid() and active
$$;

-- Security: nobody can read anything unless a rule below allows it
alter table profiles enable row level security;
alter table customers enable row level security;
alter table products enable row level security;
alter table requests enable row level security;
alter table sync_log enable row level security;
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;
alter table bot_settings enable row level security;

drop policy if exists profiles_read on profiles;
create policy profiles_read on profiles for select to authenticated
  using (id = auth.uid() or my_role() = 'founder');
drop policy if exists profiles_update on profiles;
create policy profiles_update on profiles for update to authenticated
  using (my_role() = 'founder') with check (my_role() = 'founder');

drop policy if exists customers_read on customers;
create policy customers_read on customers for select to authenticated
  using (
    my_role() in ('founder','designer','advisor')
    or (my_role() = 'packaging' and exists (
      select 1 from requests r where r.customer_id = customers.id and r.status = 'Accepted'))
  );

drop policy if exists products_public_read on products;
create policy products_public_read on products for select to anon, authenticated
  using (active or my_role() = 'founder');
drop policy if exists products_founder_write on products;
create policy products_founder_write on products for all to authenticated
  using (my_role() = 'founder') with check (my_role() = 'founder');

drop policy if exists requests_read on requests;
create policy requests_read on requests for select to authenticated
  using (
    my_role() in ('founder','designer','advisor')
    or (my_role() = 'packaging' and status = 'Accepted')
  );
drop policy if exists requests_update on requests;
create policy requests_update on requests for update to authenticated
  using (my_role() in ('founder','designer')) with check (my_role() in ('founder','designer'));

drop policy if exists sync_log_read on sync_log;
create policy sync_log_read on sync_log for select to authenticated
  using (my_role() in ('founder','designer','packaging'));

drop policy if exists chat_read on chat_messages;
create policy chat_read on chat_messages for select to authenticated
  using (my_role() in ('founder','designer','advisor'));

drop policy if exists bot_settings_founder on bot_settings;
create policy bot_settings_founder on bot_settings for all to authenticated
  using (my_role() = 'founder') with check (my_role() = 'founder');

-- The only thing the public website may do: send an order request
create or replace function submit_request(
  p_name text, p_phone text, p_product text, p_details text,
  p_source text default 'Direct', p_deadline date default null
) returns text
language plpgsql security definer set search_path = public as $$
declare cid uuid; rid text; src text;
begin
  p_name := btrim(coalesce(p_name, ''));
  p_phone := btrim(coalesce(p_phone, ''));
  p_product := btrim(coalesce(p_product, ''));
  p_details := btrim(coalesce(p_details, ''));
  src := left(coalesce(nullif(btrim(p_source), ''), 'Direct'), 30);
  if length(p_name) not between 2 and 80
     or length(p_phone) not between 6 and 30
     or length(p_product) not between 2 and 80
     or length(p_details) not between 3 and 2000 then
    raise exception 'invalid input';
  end if;
  -- simple spam guard: at most 5 requests per phone number per hour
  if (select count(*) from requests r join customers c on c.id = r.customer_id
      where c.phone = p_phone and r.created_at > now() - interval '1 hour') >= 5 then
    raise exception 'too many requests';
  end if;
  select id into cid from customers where phone = p_phone order by created_at limit 1;
  if cid is null then
    insert into customers(name, phone, source) values (p_name, p_phone, src) returning id into cid;
  end if;
  insert into requests(customer_id, product, details, source, deadline_wanted)
    values (cid, p_product, p_details, src, p_deadline) returning ref into rid;
  return rid;
end $$;
revoke all on function submit_request(text, text, text, text, text, date) from public;
grant execute on function submit_request(text, text, text, text, text, date) to anon, authenticated;

-- Starter data
insert into products(name, sort) values
  ('Photo design and framing', 1),
  ('Business card design', 2),
  ('Logo design', 3)
on conflict do nothing;

insert into bot_settings(id, faq) values (1,
  E'Delivery: a partner confirms time and cost together with your price.\nPayment: an advance starts the work.\nFiles: send photos after your request is confirmed.')
on conflict (id) do nothing;
