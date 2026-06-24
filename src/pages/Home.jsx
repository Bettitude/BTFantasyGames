import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Star, MapPin, ChevronRight, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import CountryBadge from '../components/CountryBadge';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { formatPrice } from '../utils/pointsCalculator';
import { STALE } from '../lib/queryClient';

const POS_TAG = {
  GK: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  DF: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  MF: 'bg-[#0057B8]/20 text-blue-300 border-blue-500/30',
  FW: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

function fmtDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
}

function fmtTime(timeStr) {
  return timeStr ? timeStr.slice(0, 5) : '';
}

export default function Home() {
  const { user } = useAuth();

  const { data: allPlayers = [] } = useQuery({
    queryKey: ['players'],
    queryFn:  () => api.get('/players'),
    staleTime: STALE.PLAYERS,
  });

  const { data: allFixtures = [] } = useQuery({
    queryKey: ['fixtures'],
    queryFn:  () => api.get('/fixtures'),
    staleTime: STALE.FIXTURES,
  });

  const { data: globalRanking = [] } = useQuery({
    queryKey: ['leagues-global'],
    queryFn:  () => api.get('/leagues/global'),
    staleTime: STALE.STANDINGS,
    retry: false,
  });

  const topPerformers = useMemo(
    () => [...allPlayers].sort((a, b) => b.total_pts - a.total_pts).slice(0, 6),
    [allPlayers]
  );

  const upcoming = useMemo(
    () => allFixtures.filter(f => f.status === 'NS').slice(0, 4),
    [allFixtures]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative rounded-2xl overflow-hidden mb-10"
        style={{ background: 'linear-gradient(135deg, #0B0F19 0%, #0d1a30 50%, #0B0F19 100%)', border: '1px solid #1E2A40' }}>
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg viewBox="0 0 800 400" className="w-full h-full">
            <circle cx="600" cy="200" r="160" fill="none" stroke="#00C853" strokeWidth="1.5"/>
            <circle cx="600" cy="200" r="80"  fill="none" stroke="#00C853" strokeWidth="0.8"/>
            <line x1="440" y1="200" x2="760" y2="200" stroke="#00C853" strokeWidth="0.8"/>
            <rect x="500" y="130" width="200" height="140" fill="none" stroke="#00C853" strokeWidth="0.8"/>
            <rect x="540" y="130" width="120" height="50"  fill="none" stroke="#00C853" strokeWidth="0.5"/>
            <rect x="540" y="220" width="120" height="50"  fill="none" stroke="#00C853" strokeWidth="0.5"/>
          </svg>
        </div>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #0057B8, #FFC527, #00C853)' }}/>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-8 lg:p-14">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 text-xs font-bold tracking-widest"
              style={{ background: 'rgba(0,87,184,0.15)', border: '1px solid rgba(0,87,184,0.4)', color: '#1a6fd4' }}>
              BTFF · WORLD CUP 2026 EDITION
            </div>
            <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-3" style={{ color: '#F5F7FA' }}>
              Your game.<br/>
              <span style={{ color: '#FFC527' }}>Your squad.</span><br/>
              Your glory.
            </h1>
            <p className="text-[#B0B8C8] text-lg mb-8 max-w-lg">
              Pick 15 World Cup players, manage a 100M FC budget, and earn real points as the tournament unfolds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              {user ? (
                <Link to="/build" className="btn-primary text-base px-8 py-3 flex items-center gap-2 justify-center">
                  <Zap className="w-4 h-4" fill="currentColor"/> Build My Squad
                </Link>
              ) : (
                <>
                  <Link to="/auth/signup" className="btn-primary text-base px-8 py-3">Play Free</Link>
                  <Link to="/auth/login"  className="btn-ghost   text-base px-8 py-3">Sign In</Link>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
              ['100M FC', 'Starting Budget', '#FFC527'],
              ['15',      'Players per Squad','#B0B8C8'],
              ['32',      'Nations',          '#B0B8C8'],
              ['48',      'Matches',          '#00C853'],
            ].map(([val, lbl, col]) => (
              <div key={lbl} className="rounded-xl p-4 text-center card">
                <div className="font-black text-2xl" style={{ color: col }}>{val}</div>
                <div className="text-[#B0B8C8] text-xs mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-6" style={{ color: '#F5F7FA' }}>How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step:'01', Icon: Users,  title:'Create Account',    desc:'Sign up free and get 100M FC to start building.' },
            { step:'02', Icon: Star,   title:'Pick Your Players', desc:'15 players from 32 nations. Max 3 per country.' },
            { step:'03', Icon: Trophy, title:'Set Formation',     desc:'5 formations. Choose a captain for 2× points.' },
            { step:'04', Icon: Zap,    title:'Earn Points',       desc:'Goals, assists, saves — every action scores.' },
          ].map(({ step, Icon, title, desc }) => (
            <div key={step} className="card p-5 card-hover">
              <div className="text-[#4A5568] text-xs font-bold mb-3">{step}</div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(0,87,184,0.15)' }}>
                <Icon className="w-5 h-5 text-[#0057B8]" strokeWidth={2}/>
              </div>
              <div className="font-bold text-sm mb-1" style={{ color: '#F5F7FA' }}>{title}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#B0B8C8' }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        {/* ── TOP PERFORMERS ───────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black" style={{ color: '#F5F7FA' }}>Top Performers</h2>
            <Link to="/players" className="flex items-center gap-1 text-sm text-[#FFC527] hover:text-[#e6a800]">
              View all <ChevronRight className="w-3 h-3"/>
            </Link>
          </div>
          <div className="card overflow-hidden">
            {topPerformers.length === 0 ? (
              <div className="px-4 py-8 text-center text-[#4A5568] text-sm">Loading players…</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1E2A40' }}>
                    <th className="text-left px-4 py-3 text-[#4A5568] text-xs font-semibold">#</th>
                    <th className="text-left px-4 py-3 text-[#4A5568] text-xs font-semibold">Player</th>
                    <th className="text-right px-4 py-3 text-[#4A5568] text-xs font-semibold">Price</th>
                    <th className="text-right px-4 py-3 text-[#4A5568] text-xs font-semibold">Sel%</th>
                    <th className="text-right px-4 py-3 text-[#4A5568] text-xs font-semibold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {topPerformers.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #0F1624' }}
                      className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-[#4A5568] font-bold text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CountryBadge code={p.country} size="sm"/>
                          <div>
                            <div className="font-semibold text-xs" style={{ color: '#F5F7FA' }}>{p.name}</div>
                            <span className={`badge text-[9px] ${POS_TAG[p.position]}`}>{p.position}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-[#B0B8C8] text-xs">{formatPrice(p.price_fc)}</td>
                      <td className="px-4 py-3 text-right text-[#B0B8C8] text-xs">{p.selection_pct}%</td>
                      <td className="px-4 py-3 text-right font-black text-[#FFC527]">{p.total_pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── LEADERBOARD ──────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black" style={{ color: '#F5F7FA' }}>Leaderboard</h2>
            <Link to="/leagues" className="flex items-center gap-1 text-sm text-[#FFC527] hover:text-[#e6a800]">
              All <ChevronRight className="w-3 h-3"/>
            </Link>
          </div>
          <div className="card overflow-hidden">
            {globalRanking.length === 0 ? (
              <div className="px-4 py-8 text-center text-[#4A5568] text-sm">No rankings yet</div>
            ) : globalRanking.slice(0, 8).map(entry => (
              <div key={entry.userId} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                style={{ borderBottom: '1px solid #0F1624' }}>
                <div className="w-5 text-center font-black text-xs"
                  style={{ color: entry.rank <= 3 ? '#FFC527' : '#4A5568' }}>
                  {entry.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs truncate" style={{ color: '#F5F7FA' }}>{entry.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm text-[#FFC527]">{entry.total}</div>
                  <div className="text-[10px] text-[#4A5568]">GW: {entry.gwPts}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── UPCOMING FIXTURES ────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black" style={{ color: '#F5F7FA' }}>Upcoming Fixtures</h2>
          <Link to="/fixtures" className="flex items-center gap-1 text-sm text-[#FFC527] hover:text-[#e6a800]">
            Full schedule <ChevronRight className="w-3 h-3"/>
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="card p-8 text-center text-[#4A5568] text-sm">No upcoming fixtures</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcoming.map(f => (
              <div key={f.id} className="card p-4 card-hover">
                <div className="text-[#4A5568] text-[10px] font-bold mb-3 uppercase">
                  {fmtDate(f.match_date)} · {fmtTime(f.match_time)} UTC
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-center flex-1">
                    <div className="flex justify-center mb-2"><CountryBadge code={f.home_code} size="lg"/></div>
                    <div className="font-bold text-xs" style={{ color: '#F5F7FA' }}>{f.home}</div>
                  </div>
                  <div className="text-[#4A5568] font-black text-sm px-2">VS</div>
                  <div className="text-center flex-1">
                    <div className="flex justify-center mb-2"><CountryBadge code={f.away_code} size="lg"/></div>
                    <div className="font-bold text-xs" style={{ color: '#F5F7FA' }}>{f.away}</div>
                  </div>
                </div>
                {f.venue && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-[#4A5568] text-[10px]">
                    <MapPin className="w-2.5 h-2.5"/><span className="truncate">{f.venue}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      {!user && (
        <section className="rounded-2xl p-10 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(0,87,184,0.12) 0%, rgba(255,197,39,0.06) 100%)', border: '1px solid #1E2A40' }}>
          <h2 className="text-3xl font-black mb-2" style={{ color: '#F5F7FA' }}>Ready to compete?</h2>
          <p className="text-[#B0B8C8] mb-6">Smart players win more. Start building your squad today.</p>
          <Link to="/auth/signup" className="btn-primary text-base px-10 py-3">Create Free Account</Link>
        </section>
      )}
    </div>
  );
}
