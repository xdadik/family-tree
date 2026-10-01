// Cloudflare backend client (D1 + Worker API).
// Login wall: no token = no family data. Token lives in localStorage.

const API_URL = ((import.meta.env.VITE_API_URL as string) || '').replace(/\/$/, '');
const TOKEN_KEY = 'sirojovs_api_token';

export function getApiUrl(): string {
  return API_URL;
}
export function apiConfigured(): boolean {
  return API_URL.length > 0;
}
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export interface ApiUser {
  id: string;
  login: string;
  name: string;
  role: string;
}

interface ReqOpts {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function req<T>(path: string, opts: ReqOpts = {}): Promise<T> {
  if (!API_URL) throw new Error('no-api');
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  const token = opts.token !== undefined ? opts.token : getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    let message = `http-${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore
    }
    const err = new Error(message) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  return (await res.json()) as T;
}

export interface SyncChange {
  kind: string;
  id: string;
  json: unknown | null;
}

export const api = {
  health: () => req<{ ok: boolean; users: number }>('/api/health'),
  setup: (b: { key: string; login: string; password: string; name: string }) =>
    req<{ ok: boolean }>('/api/setup', { method: 'POST', body: b }),
  login: (login: string, password: string) =>
    req<{ ok: boolean; token: string; user: ApiUser }>('/api/login', {
      method: 'POST',
      body: { login, password },
    }),
  me: () => req<{ ok: boolean; user: ApiUser }>('/api/me'),
  logout: () => req<{ ok: boolean }>('/api/logout', { method: 'POST' }).catch(() => ({ ok: true })),
  listUsers: () => req<{ ok: boolean; users: ApiUser[] }>('/api/users'),
  createUser: (b: { login: string; password: string; name: string; role: string }) =>
    req<{ ok: boolean; user: ApiUser }>('/api/users', { method: 'POST', body: b }),
  deleteUser: (id: string) => req<{ ok: boolean }>(`/api/users/${id}`, { method: 'DELETE' }),
  syncGet: () => req<{ ok: boolean; data: Record<string, Record<string, unknown>> }>('/api/sync'),
  syncPush: (changes: SyncChange[]) => req<{ ok: boolean; applied: number }>('/api/sync', { method: 'POST', body: { changes } }),
};
