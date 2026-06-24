import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../lib/api';

const AuthContext = createContext(null);
const DEMO_USER_KEY = 'btff_demo_user';

const DEMO_USER = {
  id:       'demo-user',
  email:    'demo@btff.com',
  teamName: 'Demo Team',
  isDemo:   true,
};

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(DEMO_USER_KEY)) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

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

  // Local-only stub login — no server/Supabase call, just drops the user into the app
  function signInDemo() {
    localStorage.setItem(DEMO_USER_KEY, '1');
    setUser(DEMO_USER);
  }

  async function signUp(email, password, teamName) {
    await api.post('/auth/register', { email, password, teamName });
    // Registration doesn't return a session, so log in immediately after
    return signIn(email, password);
  }

  async function signOut() {
    localStorage.removeItem(DEMO_USER_KEY);
    try { await api.post('/auth/logout', {}); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInDemo, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
