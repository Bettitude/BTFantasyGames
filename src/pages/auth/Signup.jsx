import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate   = useNavigate();
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState({ email: '', password: '', confirm: '', teamName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function nextStep(e) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters'); return; }
    setError(''); setStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.teamName.trim()) { setError('Please enter a team name'); return; }
    setError(''); setLoading(true);
    try {
      await signUp(form.email, form.password, form.teamName);
      navigate('/build', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed'); setStep(1);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0B0F19' }}>
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="relative w-9 h-9">
            <Shield className="w-9 h-9 text-[#0057B8]" fill="#0057B8" strokeWidth={0}/>
            <span className="absolute inset-0 flex items-center justify-center text-[#FFC527] font-black text-[11px]">BT</span>
          </div>
          <div className="text-white font-black text-base">BT Fantasy Football</div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black
                ${step >= s ? 'text-black' : 'text-[#4A5568]'}`}
                style={{ background: step >= s ? '#FFC527' : '#1E2A40' }}>
                {s}
              </div>
              {s < 2 && <div className="h-px w-8" style={{ background: step > s ? '#FFC527' : '#1E2A40' }}/>}
            </div>
          ))}
          <div className="ml-2 text-xs text-[#B0B8C8]">
            {step === 1 ? 'Account details' : 'Name your squad'}
          </div>
        </div>

        <h1 className="text-2xl font-black mb-1" style={{ color: '#F5F7FA' }}>
          {step === 1 ? 'Create account' : 'Name your team'}
        </h1>
        <p className="text-sm mb-6" style={{ color: '#B0B8C8' }}>
          {step === 1 ? 'Join BT Fantasy Football — smart players win more.' : 'Choose a name that strikes fear into rivals.'}
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.3)', color: '#E53935' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={nextStep} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest text-[#4A5568]">Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required/>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest text-[#4A5568]">Password</label>
              <input className="input" type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} required/>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest text-[#4A5568]">Confirm Password</label>
              <input className="input" type="password" placeholder="Repeat password"
                value={form.confirm} onChange={e => setForm(f => ({...f, confirm: e.target.value}))} required/>
            </div>
            <button type="submit" className="btn-primary mt-1 py-3 font-black">Continue</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest text-[#4A5568]">Team Name</label>
              <input className="input" type="text" placeholder="e.g. Galaxy Strikers FC" maxLength={30} autoFocus required
                value={form.teamName} onChange={e => setForm(f => ({...f, teamName: e.target.value}))}/>
              <div className="mt-1 text-[10px] text-right text-[#4A5568]">{form.teamName.length}/30</div>
            </div>

            <div className="rounded-xl p-4"
              style={{ background: 'rgba(255,197,39,0.06)', border: '1px solid rgba(255,197,39,0.2)' }}>
              <div className="text-[#FFC527] font-bold text-sm mb-1">Your starting budget</div>
              <div className="font-black text-2xl" style={{ color: '#F5F7FA' }}>100,000,000 FC</div>
              <div className="text-[#B0B8C8] text-xs mt-1">Pick 15 players from 32 World Cup nations</div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1">Back</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 font-black">
                {loading ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> : null}
                {loading ? 'Creating…' : 'Start Playing'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#4A5568]">
          Have an account?{' '}
          <Link to="/auth/login" className="text-[#FFC527] font-bold hover:text-[#e6a800]">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
