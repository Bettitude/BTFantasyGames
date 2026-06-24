const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'btff_access_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, opts = {}) {
  const token = getToken();
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
