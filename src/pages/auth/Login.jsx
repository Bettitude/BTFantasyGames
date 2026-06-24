import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm]             = useState({ email: '', password: '' });
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  }

  async function handleDemo() {
    setError('');
    setDemoLoading(true);
    try {
      await signIn('demo@btff.com', 'demo1234');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally { setDemoLoading(false); }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0B0F19' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B0F19 0%, #0d1a30 100%)', borderRight: '1px solid #1E2A40' }}>
        {/* Pitch decoration */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 400 500" className="w-full h-full">
            <rect x="30" y="10" width="340" height="480" rx="4" fill="none" stroke="#00C853" strokeWidth="1.5"/>
            <line x1="30" y1="250" x2="370" y2="250" stroke="#00C853" strokeWidth="1"/>
            <circle cx="200" cy="250" r="60" fill="none" stroke="#00C853" strokeWidth="1"/>
            <rect x="110" y="10" width="180" height="80" fill="none" stroke="#00C853" strokeWidth="0.8"/>
            <rect x="150" y="10" width="100" height="35" fill="none" stroke="#00C853" strokeWidth="0.5"/>
            <rect x="110" y="410" width="180" height="80" fill="none" stroke="#00C853" strokeWidth="0.8"/>
            <rect x="150" y="455" width="100" height="35" fill="none" stroke="#00C853" strokeWidth="0.5"/>
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Shield className="w-12 h-12 text-[#0057B8]" fill="#0057B8" strokeWidth={0}/>
              <span className="absolute inset-0 flex items-center justify-center text-[#FFC527] font-black text-sm">BT</span>
            </div>
            <div>
              <div className="text-white font-black text-xl tracking-tight">BT Fantasy</div>
              <div className="text-[#FFC527] text-xs font-bold tracking-widest">FOOTBALL</div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-black leading-tight mb-4" style={{ color: '#F5F7FA' }}>
            Your game.<br/>
            <span style={{ color: '#FFC527' }}>Your squad.</span><br/>
            Your glory.
          </h2>
          <p className="text-[#B0B8C8] text-base leading-relaxed">
            Fantasy football where data meets instinct. Pick from 32 World Cup nations, manage a 100M FC budget.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[['100M FC','Budget'],['15','Players'],['2026','Edition']].map(([val, lbl]) => (
              <div key={lbl} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(0,87,184,0.1)', border: '1px solid rgba(0,87,184,0.3)' }}>
                <div className="font-black text-lg text-[#FFC527]">{val}</div>
                <div className="text-[#B0B8C8] text-xs">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[#4A5568] text-xs">&copy; 2026 BT Fantasy Football · btfantasyfootball.com</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="relative w-9 h-9">
              <Shield className="w-9 h-9 text-[#0057B8]" fill="#0057B8" strokeWidth={0}/>
              <span className="absolute inset-0 flex items-center justify-center text-[#FFC527] font-black text-[11px]">BT</span>
            </div>
            <div>
              <div className="text-white font-black text-base tracking-tight">BT Fantasy Football</div>
            </div>
          </div>

          {/* Demo button — top, prominent */}
          <button onClick={handleDemo} disabled={demoLoading || loading}
            className="w-full mb-6 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, #FFC527 0%, #e6a800 100%)',
              color: '#000',
              boxShadow: '0 4px 20px rgba(255,197,39,0.3)',
            }}>
            {demoLoading
              ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>
              : <Zap className="w-4 h-4" fill="currentColor"/>
            }
            {demoLoading ? 'Entering…' : 'Try Demo — instant access'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid #1E2A40' }}/>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[#4A5568] text-xs" style={{ background: '#0B0F19' }}>or sign in with your account</span>
            </div>
          </div>

          <h1 className="text-2xl font-black mb-1" style={{ color: '#F5F7FA' }}>Welcome back</h1>
          <p className="text-sm mb-6" style={{ color: '#B0B8C8' }}>Sign in to manage your fantasy squad</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.3)', color: '#E53935' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest text-[#4A5568]">Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required autoComplete="email"/>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#4A5568]">Password</label>
                <a href="#" className="text-xs text-[#0057B8] hover:text-[#1a6fd4]">Forgot?</a>
              </div>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} required autoComplete="current-password"/>
            </div>
            <button type="submit" disabled={loading || demoLoading} className="btn-blue mt-1 flex items-center justify-center gap-2 py-3">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#4A5568]">
            No account?{' '}
            <Link to="/auth/signup" className="text-[#FFC527] font-bold hover:text-[#e6a800]">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
