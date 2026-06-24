import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }

    // Restore session by validating the stored token against the server
    api.get('/auth/me')
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function signIn(email, password) {
    const data = await api.post('/auth/login', { email, password });
    setToken(data.accessToken);
    setUser(data.user);
    return data;
  }

  async function signUp(email, password, teamName) {
    await api.post('/auth/register', { email, password, teamName });
    // Registration doesn't return a session, so log in immediately after
    return signIn(email, password);
  }

  async function signOut() {
    try { await api.post('/auth/logout', {}); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
