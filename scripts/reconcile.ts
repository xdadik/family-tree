// Reconcile local INITIAL dataset → cloud (adds new rows, updates changed ones, never deletes).
// Renames the owner account to the full name.
//   $env:RC_API="https://...workers.dev"; $env:RC_LOGIN="admin"; $env:RC_PASSWORD="..."
//   $env:RC_OWNER_NAME="Dadajon Xudoyberdiyev"; npx tsx scripts/reconcile.ts
import {
  INITIAL_MEMBERS,
  INITIAL_TIMELINE,
  INITIAL_NOTES,
} from '../src/data/initialData';

const API = (process.env.RC_API || '').replace(/\/$/, '');
const LOGIN = (process.env.RC_LOGIN || '').toLowerCase();
const PASSWORD = process.env.RC_PASSWORD || '';
const OWNER_NAME = process.env.RC_OWNER_NAME || '';

if (!API || !LOGIN || !PASSWORD) {
  console.error('missing-env');
  process.exit(1);
}

async function call(path: string, opts: { method?: string; body?: unknown; token?: string } = {}) {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
  const res = await fetch(`${API}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const data = (await res.json()) as { ok?: boolean; error?: string } & Record<string, unknown>;
  if (!res.ok || data.ok === false) throw new Error(`rc-fail ${path}: ${data.error || res.status}`);
  return data;
}

const logged = (await call('/api/login', { method: 'POST', body: { login: LOGIN, password: PASSWORD } })) as {
  token: string;
  user: { id: string; role: string; name: string };
};
const token = logged.token;
console.log(`login-ok role:${logged.user.role} name:${logged.user.name}`);

if (OWNER_NAME && logged.user.name !== OWNER_NAME) {
  await call(`/api/users/${logged.user.id}`, { method: 'PATCH', token, body: { name: OWNER_NAME } });
  console.log('owner-renamed:1');
}

const sync = (await call('/api/sync', { token })) as {
  data: Record<string, Record<string, unknown>>;
};
const server = sync.data;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const kinds: { kind: string; rows: { id: string }[] }[] = [
  { kind: 'member', rows: INITIAL_MEMBERS },
  { kind: 'timeline', rows: INITIAL_TIMELINE },
  { kind: 'note', rows: INITIAL_NOTES },
];

let added = 0;
let updated = 0;
const changes: { kind: string; id: string; json: unknown }[] = [];
for (const { kind, rows } of kinds) {
  const bucket = server[kind] || {};
  for (const row of rows) {
    const existing = bucket[row.id];
    if (existing === undefined) {
      changes.push({ kind, id: row.id, json: row });
      added++;
    } else if (!same(existing, row)) {
      changes.push({ kind, id: row.id, json: row });
      updated++;
    }
  }
}
if (changes.length > 0) {
  await call('/api/sync', { method: 'POST', token, body: { changes } });
}
console.log(`added:${added} updated:${updated}`);

const verify = (await call('/api/sync', { token })) as {
  data: Record<string, Record<string, unknown>>;
};
const count = (k: string) => Object.keys(verify.data[k] || {}).length;
console.log(`members:${count('member')} timeline:${count('timeline')} notes:${count('note')}`);
for (const id of ['muhidin', 'dilsuz', 'dadajon', 'javohir', 'shaxnoza', 'gulnora']) {
  const m = (verify.data.member?.[id] || {}) as { fullName?: string; spouseId?: string; parentIds?: string[] };
  console.log(`${id}:${m.fullName || '?'} spouse:${m.spouseId || '-'} parents:${(m.parentIds || []).join(',')}`);
}
console.log('reconcile-done');
