// Sends an accepted request to the partners website (as a Lead, or as an Order).
// Turn "Verify JWT" OFF when deploying (this function checks the partner's login itself).
// Secrets needed: PARTNER_API_URL, PARTNER_API_KEY (the partners website endpoint and its secret key).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // Who is calling? Must be a signed-in, active founder or designer.
  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
  const { data: userData } = await db.auth.getUser(token)
  const user = userData?.user
  if (!user) return json({ error: 'Not signed in' }, 401)
  const { data: me } = await db.from('profiles').select('role, active').eq('id', user.id).single()
  if (!me?.active || !['founder', 'designer'].includes(me.role)) return json({ error: 'Not allowed' }, 403)

  let input: { request_id?: string; target?: string }
  try { input = await req.json() } catch { return json({ error: 'Bad request' }, 400) }
  const target = input.target === 'Order' ? 'Order' : 'Lead'

  const { data: r } = await db.from('requests')
    .select('*, customers(name, phone)').eq('id', input.request_id ?? '').single()
  if (!r) return json({ error: 'Request not found' }, 404)
  if (r.status !== 'Accepted') return json({ error: 'Only accepted requests can be sent' }, 400)

  let status: 'Sent' | 'Failed' = 'Failed'
  let note = ''
  const url = Deno.env.get('PARTNER_API_URL')
  if (!url) {
    note = 'PARTNER_API_URL is not set yet'
  } else {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': Deno.env.get('PARTNER_API_KEY') ?? '' },
        body: JSON.stringify({
          reference: r.ref,
          type: target,
          customer: { name: r.customers?.name, phone: r.customers?.phone },
          product: r.product,
          details: r.details,
          price: r.price,
          advance: r.advance,
          due: r.due,
          source: r.source,
        }),
      })
      note = `HTTP ${res.status}`
      if (res.ok) status = 'Sent'
    } catch (e) {
      note = `Network error: ${(e as Error).message}`
    }
  }

  await db.from('requests').update({ sync_status: status, sync_target: target }).eq('id', r.id)
  await db.from('sync_log').insert({ request_id: r.id, target, status, response: note })
  return json({ status, note })
})
