// Sirojovlar family API — Cloudflare Worker + D1 + R2.
// Auth: login/password accounts created by the owner. Bearer sessions (90 days).
// Login wall: every endpoint except /api/health needs a valid session.

interface D1Prepared {
  bind(...values: unknown[]): D1Prepared;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
interface D1Database {
  prepare(query: string): D1Prepared;
  batch(statements: D1Prepared[]): Promise<unknown[]>;
}
interface R2Object {
  body: ReadableStream;
  httpMetadata?: { contentType?: string };
}
interface R2Bucket {
  put(key: string, value: ArrayBuffer | string, opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<R2Object | null>;
  delete(key: string): Promise<void>;
}
interface Env {
  DB: D1Database;
  PHOTOS: R2Bucket;
  BOOTSTRAP_KEY?: string;
  APP_ORIGIN?: string;
}

interface UserRow {
  id: string;
  login: string;
  pass_salt: string;
  pass_hash: string;
  name: string;
  role: string;
  created_at: string;
}
interface SessionRow {
  token: string;
  user_id: string;
  expires_at: number;
}

const SESSION_DAYS = 90;

// ---------- helpers ----------

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function newId(prefix: string): string {
  const b = crypto.getRandomValues(new Uint8Array(12));
  return `${prefix}_${Date.now().toString(36)}${bytesToHex(b).slice(0, 8)}`;
}
function newToken(): string {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

async function hashPassword(password: string, saltHex?: string): Promise<{ salt: string; hash: string }> {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 100000, hash: 'SHA-256' },
    key,
    256,
  );
  return { salt: bytesToHex(salt), hash: bytesToHex(new Uint8Array(bits)) };
}

function corsHeaders(env: Env): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': env.APP_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };
}
function json(data: unknown, env: Env, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  });
}
function fail(message: string, env: Env, status = 400): Response {
  return json({ ok: false, error: message }, env, status);
}

async function authUser(req: Request, env: Env): Promise<UserRow | null> {
  const header = req.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  const session = await env.DB.prepare('SELECT token, user_id, expires_at FROM sessions WHERE token = ?')
    .bind(token)
    .first<SessionRow>();
  if (!session || session.expires_at < Date.now()) {
    if (session) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  const user = await env.DB.prepare(
    'SELECT id, login, pass_salt, pass_hash, name, role, created_at FROM users WHERE id = ?',
  )
    .bind(session.user_id)
    .first<UserRow>();
  return user;
}
function publicUser(u: UserRow): { id: string; login: string; name: string; role: string } {
  return { id: u.id, login: u.login, name: u.name, role: u.role };
}
function isPrivileged(u: UserRow): boolean {
  return u.role === 'owner' || u.role === 'admin';
}

// ---------- router ----------

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    try {
      // Public: health + first-owner bootstrap info
      if (path === '/api/health' && req.method === 'GET') {
        const row = await env.DB.prepare('SELECT COUNT(*) AS c FROM users').first<{ c: number }>();
        return json({ ok: true, users: row ? row.c : 0 }, env);
      }

      // Public: create the very first owner (needs the bootstrap key, usable only while no users exist)
      if (path === '/api/setup' && req.method === 'POST') {
        const body = (await req.json()) as { key?: string; login?: string; password?: string; name?: string };
        const count = await env.DB.prepare('SELECT COUNT(*) AS c FROM users').first<{ c: number }>();
        if (count && count.c > 0) return fail('setup-closed', env, 403);
        if (!env.BOOTSTRAP_KEY || body.key !== env.BOOTSTRAP_KEY) return fail('bad-key', env, 403);
        const login = (body.login || '').trim().toLowerCase();
        if (!login || login.length < 3 || !body.password || body.password.length < 4 || !body.name?.trim()) {
          return fail('bad-input', env);
        }
        const { salt, hash } = await hashPassword(body.password);
        const id = newId('u');
        await env.DB.prepare(
          'INSERT INTO users (id, login, pass_salt, pass_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        )
          .bind(id, login, salt, hash, body.name.trim(), 'owner', new Date().toISOString())
          .run();
        return json({ ok: true }, env);
      }

      // Public: login
      if (path === '/api/login' && req.method === 'POST') {
        const body = (await req.json()) as { login?: string; password?: string };
        const login = (body.login || '').trim().toLowerCase();
        if (!login || !body.password) return fail('bad-login', env, 401);
        const user = await env.DB.prepare(
          'SELECT id, login, pass_salt, pass_hash, name, role, created_at FROM users WHERE login = ?',
        )
          .bind(login)
          .first<UserRow>();
        if (!user) return fail('bad-login', env, 401);
        const { hash } = await hashPassword(body.password, user.pass_salt);
        if (hash !== user.pass_hash) return fail('bad-login', env, 401);
        const token = newToken();
        const expires = Date.now() + SESSION_DAYS * 24 * 3600 * 1000;
        await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
          .bind(token, user.id, expires)
          .run();
        return json({ ok: true, token, user: publicUser(user) }, env);
      }

      // Public: photo download via unguessable capability URLs (so <img> tags work without Authorization header)
      if (path.startsWith('/api/photos/') && req.method === 'GET') {
        const key = path.slice('/api/photos/'.length);
        if (!key || key.includes('/') || key.includes('..')) return fail('bad-key', env);
        const obj = await env.PHOTOS.get(key);
        if (!obj) return fail('not-found', env, 404);
        return new Response(obj.body, {
          headers: {
            'Content-Type': obj.httpMetadata?.contentType || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
            ...corsHeaders(env),
          },
        });
      }

      // Everything below needs a session (login wall: no session = no family data)
      const me = await authUser(req, env);
      if (!me) return fail('unauthorized', env, 401);

      if (path === '/api/me' && req.method === 'GET') {
        return json({ ok: true, user: publicUser(me) }, env);
      }

      if (path === '/api/logout' && req.method === 'POST') {
        const header = req.headers.get('Authorization') || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : '';
        if (token) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
        return json({ ok: true }, env);
      }

      // Owner: list/create/delete accounts
      if (path === '/api/users' && req.method === 'GET') {
        if (me.role !== 'owner') return fail('forbidden', env, 403);
        const rows = await env.DB.prepare('SELECT id, login, name, role, created_at FROM users ORDER BY created_at')
          .all<UserRow>();
        return json({ ok: true, users: rows.results }, env);
      }
      if (path === '/api/users' && req.method === 'POST') {
        if (me.role !== 'owner') return fail('forbidden', env, 403);
        const body = (await req.json()) as { login?: string; password?: string; name?: string; role?: string };
        const login = (body.login || '').trim().toLowerCase().replace(/\s+/g, '');
        const role = body.role === 'admin' ? 'admin' : 'viewer';
        if (!login || login.length < 3 || !body.password || body.password.length < 4 || !body.name?.trim()) {
          return fail('bad-input', env);
        }
        const exists = await env.DB.prepare('SELECT id FROM users WHERE login = ?').bind(login).first<{ id: string }>();
        if (exists) return fail('login-taken', env, 409);
        const { salt, hash } = await hashPassword(body.password);
        const id = newId('u');
        await env.DB.prepare(
          'INSERT INTO users (id, login, pass_salt, pass_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        )
          .bind(id, login, salt, hash, body.name.trim(), role, new Date().toISOString())
          .run();
        return json({ ok: true, user: { id, login, name: body.name.trim(), role } }, env);
      }
      if (path.startsWith('/api/users/') && req.method === 'DELETE') {
        if (me.role !== 'owner') return fail('forbidden', env, 403);
        const id = path.slice('/api/users/'.length);
        if (id === me.id) return fail('cannot-delete-self', env);
        await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id).run();
        await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
        return json({ ok: true }, env);
      }

      // Pull whole family dataset (one call per app open)
      if (path === '/api/sync' && req.method === 'GET') {
        const rows = await env.DB.prepare('SELECT kind, id, json FROM records').all<{
          kind: string;
          id: string;
          json: string;
        }>();
        const data: Record<string, Record<string, unknown>> = {};
        for (const r of rows.results) {
          if (!data[r.kind]) data[r.kind] = {};
          try {
            data[r.kind][r.id] = JSON.parse(r.json);
          } catch {
            // skip corrupt row
          }
        }
        return json({ ok: true, data }, env);
      }

      // Push changes (admin/owner only)
      if (path === '/api/sync' && req.method === 'POST') {
        if (!isPrivileged(me)) return fail('forbidden', env, 403);
        const body = (await req.json()) as {
          changes?: { kind?: string; id?: string; json?: unknown | null }[];
        };
        const changes = Array.isArray(body.changes) ? body.changes : [];
        if (changes.length > 2000) return fail('too-many', env, 413);
        const now = new Date().toISOString();
        const stmts: D1Prepared[] = [];
        for (const c of changes) {
          if (!c.kind || !c.id || !/^[a-z]+$/.test(c.kind)) continue;
          if (c.json === null) {
            stmts.push(env.DB.prepare('DELETE FROM records WHERE kind = ? AND id = ?').bind(c.kind, c.id));
          } else {
            stmts.push(
              env.DB.prepare(
                'INSERT INTO records (kind, id, json, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(kind, id) DO UPDATE SET json = excluded.json, updated_at = excluded.updated_at',
              ).bind(c.kind, c.id, JSON.stringify(c.json), now),
            );
          }
        }
        for (let i = 0; i < stmts.length; i += 50) {
          await env.DB.batch(stmts.slice(i, i + 50));
        }
        return json({ ok: true, applied: stmts.length }, env);
      }

      // Photo upload → R2 (admin/owner only). Body: raw bytes, ?contentType=
      if (path === '/api/photos' && req.method === 'POST') {
        if (!isPrivileged(me)) return fail('forbidden', env, 403);
        const contentType = url.searchParams.get('contentType') || 'image/jpeg';
        if (!contentType.startsWith('image/')) return fail('not-image', env, 415);
        const buf = await req.arrayBuffer();
        if (buf.byteLength === 0 || buf.byteLength > 8 * 1024 * 1024) return fail('bad-size', env, 413);
        const key = `${Date.now().toString(36)}-${bytesToHex(crypto.getRandomValues(new Uint8Array(8)))}.jpg`;
        await env.PHOTOS.put(key, buf, { httpMetadata: { contentType } });
        return json({ ok: true, key, url: `/api/photos/${key}` }, env);
      }

      return fail('not-found', env, 404);
    } catch (e) {
      return fail(e instanceof Error ? e.message : 'error', env, 500);
    }
  },
};
