   // @ts-nocheck
// Founder invites a partner by email. The partner gets a link to set a password.
// Turn "Verify JWT" OFF when deploying (this function checks the founder's login itself).
// Secret needed: SITE_URL (the address of your admin page, for example https://yoursite.com/admin/).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const ROLES = ['founder', 'designer', 'packaging', 'advisor', 'advertising']
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
  const { data: userData } = await db.auth.getUser(token)
  const user = userData?.user
  if (!user) return json({ error: 'Not signed in' }, 401)
  const { data: me } = await db.from('profiles').select('role, active').eq('id', user.id).single()
  if (!me?.active || me.role !== 'founder') return json({ error: 'Only the founder can invite partners' }, 403)

  let input: { email?: string; full_name?: string; role?: string }
  try { input = await req.json() } catch { return json({ error: 'Bad request' }, 400) }
  const email = String(input.email ?? '').trim().toLowerCase()
  const fullName = String(input.full_name ?? '').trim().slice(0, 80)
  const role = String(input.role ?? '')
  if (!EMAIL.test(email) || fullName.length < 2 || !ROLES.includes(role)) {
    return json({ error: 'Enter a name, a valid email and a role' }, 400)
  }

  const { data, error } = await db.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
    redirectTo: Deno.env.get('SITE_URL') ?? undefined,
  })
  if (error || !data?.user) return json({ error: error?.message ?? 'Could not send the invite' }, 400)

  const { error: pErr } = await db.from('profiles').upsert({ id: data.user.id, full_name: fullName, role, active: true })
  if (pErr) return json({ error: pErr.message }, 400)
  return json({ ok: true })
})
