// One-time cloud seed: creates the owner account (if none) and uploads the
// initial family dataset. Secrets come from env, never hardcoded.
//   $env:SEED_API="https://...workers.dev"; $env:SEED_BOOTSTRAP="...";
//   $env:SEED_LOGIN="admin"; $env:SEED_PASSWORD="..."; $env:SEED_NAME="Dadajon X"
//   npx tsx scripts/seed.ts
import { INITIAL_MEMBERS, INITIAL_TIMELINE, INITIAL_NOTES } from '../src/data/initialData';

const API = (process.env.SEED_API || '').replace(/\/$/, '');
const BOOTSTRAP = process.env.SEED_BOOTSTRAP || '';
const LOGIN = (process.env.SEED_LOGIN || 'admin').toLowerCase();
const PASSWORD = process.env.SEED_PASSWORD || '';
const NAME = process.env.SEED_NAME || 'Dadajon X';

if (!API || !BOOTSTRAP || !PASSWORD) {
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
  if (!res.ok || data.ok === false) throw new Error(`seed-fail ${path}: ${data.error || res.status}`);
  return data;
}

const health = (await call('/api/health')) as { users: number };
console.log(`users-before:${health.users}`);

if (health.users === 0) {
  await call('/api/setup', {
    method: 'POST',
    body: { key: BOOTSTRAP, login: LOGIN, password: PASSWORD, name: NAME },
  });
  console.log('owner-created:1');
}

const logged = (await call('/api/login', { method: 'POST', body: { login: LOGIN, password: PASSWORD } })) as {
  token: string;
};
const sync = (await call('/api/sync', { token: logged.token })) as {
  data: Record<string, Record<string, unknown>>;
};
const existing = sync.data.member ? Object.keys(sync.data.member).length : 0;
console.log(`members-before:${existing}`);

if (existing === 0) {
  const changes = [
    ...INITIAL_MEMBERS.map((m) => ({ kind: 'member', id: m.id, json: m })),
    ...INITIAL_TIMELINE.map((e) => ({ kind: 'timeline', id: e.id, json: e })),
    ...INITIAL_NOTES.map((n) => ({ kind: 'note', id: n.id, json: n })),
  ];
  const pushed = (await call('/api/sync', { method: 'POST', token: logged.token, body: { changes } })) as {
    applied: number;
  };
  console.log(`seeded-rows:${pushed.applied}`);
}

const verify = (await call('/api/sync', { token: logged.token })) as {
  data: Record<string, Record<string, unknown>>;
};
console.log(
  `members-after:${Object.keys(verify.data.member || {}).length} ` +
    `timeline-after:${Object.keys(verify.data.timeline || {}).length} ` +
    `notes-after:${Object.keys(verify.data.note || {}).length}`,
);
console.log('seed-done');
