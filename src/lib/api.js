import { supabase } from './supabase.js';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token ?? null;
}

async function request(path, opts = {}) {
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(json.error || `API error ${res.status}`);
  return json.data;
}

export const api = {
  get:    path         => request(path),
  post:   (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body) => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (path, body) => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: path         => request(path, { method: 'DELETE' }),
};
