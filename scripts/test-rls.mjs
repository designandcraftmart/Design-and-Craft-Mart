// Run: node --env-file=.env.local scripts/test-rls.mjs
// Needs Anonymous Sign-Ins enabled and seed.sql applied.
// Leaves 1-2 small test rows (guests cannot delete); clear them from the dashboard if you like.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) { console.error("Missing Supabase env vars."); process.exit(1); }

const mk = () => createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  (" + extra + ")" : ""}`);
  if (!ok) failed++;
};
const guest = async () => {
  const c = mk();
  const { data, error } = await c.auth.signInAnonymously();
  if (error) throw new Error("Anonymous sign-in failed: " + error.message);
  return { c, uid: data.user.id };
};

// 1. Anon (no session) can read products, not hidden ones
{
  const c = mk();
  const { data, error } = await c.from("products").select("slug, stock_status");
  check("anon can read products", !error && data.length > 0, error?.message ?? `${data?.length} rows`);
  check("anon sees no hidden products", !error && data.every((p) => p.stock_status !== "hidden"));
}

// 2. Anon cannot read private tables
for (const t of ["orders", "order_items", "payments", "order_events", "customers", "conversations", "messages", "admin_profiles"]) {
  const c = mk();
  const { data, error } = await c.from(t).select("id").limit(5);
  check(`anon cannot read ${t}`, !!error || (data ?? []).length === 0);
}

// 3. Guest A creates a chat; guest B cannot see it
const A = await guest();
const B = await guest();

const { data: custA, error: e1 } = await A.c.from("customers")
  .insert({ user_id: A.uid, name: "Test A", phone: "01700000000" }).select().single();
check("guest A can create own customer row", !e1 && custA, e1?.message);

const { data: convA, error: e2 } = await A.c.from("conversations")
  .insert({ customer_id: custA?.id }).select().single();
check("guest A can open a conversation", !e2 && convA, e2?.message);

const { error: e3 } = await A.c.from("messages")
  .insert({ conversation_id: convA?.id, sender_type: "customer", sender_id: A.uid, body: "Hello DCM" });
check("guest A can send a message", !e3, e3?.message);

const { data: seenA } = await A.c.from("messages").select("id").eq("conversation_id", convA?.id);
check("guest A can read own messages", (seenA ?? []).length === 1);

const { data: seenB } = await B.c.from("messages").select("id").eq("conversation_id", convA?.id);
check("guest B CANNOT read guest A's messages", (seenB ?? []).length === 0);

const { data: convSeenB } = await B.c.from("conversations").select("id").eq("id", convA?.id);
check("guest B CANNOT read guest A's conversation", (convSeenB ?? []).length === 0);

const { error: e4 } = await B.c.from("messages")
  .insert({ conversation_id: convA?.id, sender_type: "customer", sender_id: B.uid, body: "intruder" });
check("guest B CANNOT post into guest A's conversation", !!e4);

const { error: e5 } = await A.c.from("messages")
  .insert({ conversation_id: convA?.id, sender_type: "organiser", sender_id: A.uid, body: "fake staff" });
check("guest cannot post as organiser", !!e5);

const { error: e6 } = await A.c.from("orders").insert({ customer_id: custA?.id });
check("guest cannot create orders", !!e6);

const { error: e7 } = await A.c.from("products").update({ base_price: 1 }).eq("slug", "photo-mug");
const { data: pm } = await mk().from("products").select("base_price").eq("slug", "photo-mug").single();
check("guest cannot change product prices", Number(pm?.base_price) !== 1, e7?.message ?? "no rows updated");

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
