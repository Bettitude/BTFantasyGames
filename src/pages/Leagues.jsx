import { useState } from 'react';
import { Globe, Lock, Trophy, Copy, Check, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { STALE } from '../lib/queryClient';

const MEDAL = [
  <Trophy key="1" className="w-4 h-4 text-yellow-400"/>,
  <Trophy key="2" className="w-4 h-4 text-slate-300"/>,
  <Trophy key="3" className="w-4 h-4 text-amber-600"/>,
];

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className="px-4 py-2 rounded-xl text-sm font-bold transition-colors"
      style={active
        ? { background: '#0057B8', color: '#fff' }
        : { background: 'rgba(255,255,255,0.03)', color: '#B0B8C8', border: '1px solid #2A3654' }}>
      {children}
    </button>
  );
}

export default function Leagues() {
  const qc = useQueryClient();
  const [tab, setTab]               = useState('my');
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinCode, setJoinCode]     = useState('');
  const [newName, setNewName]       = useState('');
  const [newType, setNewType]       = useState('private');
  const [createdLeague, setCreatedLeague] = useState(null);
  const [copied, setCopied]         = useState(false);
  const [joinError, setJoinError]   = useState('');
  const [joining, setJoining]       = useState(false);
  const [creating, setCreating]     = useState(false);

  const { data: myLeagues = [], isLoading: myLoading } = useQuery({
    queryKey: ['leagues'],
    queryFn:  () => api.get('/leagues'),
    staleTime: STALE.PLAYER,
    retry: false,
  });

  const { data: globalData = [], isLoading: globalLoading } = useQuery({
    queryKey: ['leagues-global'],
    queryFn:  () => api.get('/leagues/global'),
    staleTime: STALE.STANDINGS,
    enabled: tab === 'global',
  });

  const { data: standingsData = [], isLoading: standingsLoading } = useQuery({
    queryKey: ['league-standings', selectedLeague?.id],
    queryFn:  () => api.get(`/leagues/${selectedLeague?.id}/standings`),
    staleTime: STALE.PLAYER,
    enabled: !!selectedLeague,
  });

  function handleCopy(code) {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const league = await api.post('/leagues', { name: newName.trim(), type: newType });
      setCreatedLeague(league);
      setNewName('');
      qc.invalidateQueries({ queryKey: ['leagues'] });
    } catch {
      // keep modal open on error
    } finally {
      setCreating(false);
    }
  }

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setJoining(true);
    setJoinError('');
    try {
      await api.post('/leagues/join', { code: joinCode.trim() });
      setJoinCode('');
      qc.invalidateQueries({ queryKey: ['leagues'] });
    } catch (e) {
      setJoinError(e.message || 'Invalid code or already a member');
    } finally {
      setJoining(false);
    }
  }

  function closeCreate() {
    setCreateOpen(false);
    setCreatedLeague(null);
    setNewName('');
  }

  // First league stats for the stats panel
  const firstLeague = myLeagues[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-black mb-1" style={{ color: '#F5F7FA' }}>Leagues</h1>
        <p className="text-sm text-[#B0B8C8]">Compete with friends or the entire world</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <TabBtn active={tab === 'my'}     onClick={() => { setTab('my'); setSelectedLeague(null); }}>My Leagues</TabBtn>
        <TabBtn active={tab === 'global'} onClick={() => { setTab('global'); setSelectedLeague(null); }}>Global</TabBtn>
        <div className="ml-auto">
          <button onClick={() => setCreateOpen(true)} className="btn-primary px-4 py-2 text-sm font-bold">
            + Create League
          </button>
        </div>
      </div>

      {/* ── My Leagues Tab ──────────────────────────────────────────── */}
      {tab === 'my' && !selectedLeague && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {myLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#0057B8]"/>
              </div>
            ) : myLeagues.length === 0 ? (
              <div className="card p-8 text-center text-[#B0B8C8] text-sm">
                You haven't joined any leagues yet.
              </div>
            ) : myLeagues.map(league => (
              <div key={league.id} className="card p-5 card-hover cursor-pointer"
                onClick={() => setSelectedLeague(league)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-black text-base" style={{ color: '#F5F7FA' }}>{league.name}</div>
                    <div className="flex items-center gap-1.5 text-[#4A5568] text-xs mt-0.5">
                      {league.type === 'public'
                        ? <><Globe className="w-3 h-3"/> Public</>
                        : <><Lock className="w-3 h-3"/> Private</>}
                      {league.code && (
                        <span className="ml-1 font-mono text-[#B0B8C8]">{league.code}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {league.myRank
                      ? <>
                          <div className="font-black text-xl text-[#FFC527]">#{league.myRank}</div>
                          <div className="text-[#4A5568] text-xs">Your rank</div>
                        </>
                      : <div className="text-[#4A5568] text-xs">View standings →</div>
                    }
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-[#4A5568]">
                  <span>{league.myTotalPts ?? 0} pts total</span>
                  <span>{league.myGwPts ?? 0} pts this GW</span>
                </div>
              </div>
            ))}

            {/* Join section */}
            <div className="card p-5">
              <h3 className="font-bold mb-3 text-sm" style={{ color: '#F5F7FA' }}>Join a Private League</h3>
              <div className="flex gap-2">
                <input className="input flex-1" placeholder="Enter league code e.g. BTFF-XK9A2B"
                  value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}/>
                <button className="btn-primary px-4 font-bold flex items-center gap-1"
                  disabled={!joinCode.trim() || joining} onClick={handleJoin}>
                  {joining ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Join'}
                </button>
              </div>
              {joinError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#E53935]">
                  <AlertCircle className="w-3 h-3 shrink-0"/>{joinError}
                </div>
              )}
            </div>
          </div>

          {/* Stats panel */}
          <div className="card p-5">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wide" style={{ color: '#F5F7FA' }}>Your Stats</h3>
            {firstLeague ? (
              <>
                {[
                  ['Current Rank',   firstLeague.myRank ? `#${firstLeague.myRank}` : '—'],
                  ['Total Points',   `${firstLeague.myTotalPts ?? 0} pts`],
                  ['This GW',        `${firstLeague.myGwPts ?? 0} pts`],
                  ['Leagues Joined', myLeagues.length.toString()],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center py-2"
                    style={{ borderBottom: '1px solid #0F1624' }}>
                    <span className="text-[#B0B8C8] text-sm">{label}</span>
                    <span className="font-bold text-sm" style={{ color: '#F5F7FA' }}>{val}</span>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-[#4A5568] text-sm">Join a league to see your stats.</p>
            )}
          </div>
        </div>
      )}

      {/* ── League Standings (drill-down) ───────────────────────────── */}
      {tab === 'my' && selectedLeague && (
        <div>
          <button onClick={() => setSelectedLeague(null)}
            className="flex items-center gap-1 text-sm text-[#B0B8C8] hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4"/> Back to Leagues
          </button>
          <div className="card overflow-hidden">
            <div className="px-4 py-3 flex justify-between items-center" style={{ borderBottom: '1px solid #1E2A40' }}>
              <span className="font-bold" style={{ color: '#F5F7FA' }}>{selectedLeague.name}</span>
              <div className="flex items-center gap-1.5 text-[#4A5568] text-xs">
                {selectedLeague.type === 'public' ? <Globe className="w-3 h-3"/> : <Lock className="w-3 h-3"/>}
                {selectedLeague.type}
              </div>
            </div>
            {standingsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#0057B8]"/>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1E2A40' }}>
                    <th className="text-left px-4 py-3 text-[#4A5568] text-xs font-semibold">Rank</th>
                    <th className="text-left px-4 py-3 text-[#4A5568] text-xs font-semibold">Team</th>
                    <th className="text-right px-4 py-3 text-[#4A5568] text-xs font-semibold">GW</th>
                    <th className="text-right px-4 py-3 text-[#4A5568] text-xs font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {standingsData.map(entry => (
                    <tr key={entry.userId} className="hover:bg-white/[0.02] transition-colors"
                      style={{ borderBottom: '1px solid #0F1624' }}>
                      <td className="px-4 py-3">
                        {entry.rank <= 3
                          ? MEDAL[entry.rank - 1]
                          : <span className="font-black text-sm text-[#4A5568]">#{entry.rank}</span>}
                      </td>
                      <td className="px-4 py-3 font-semibold text-sm" style={{ color: '#F5F7FA' }}>{entry.name}</td>
                      <td className="px-4 py-3 text-right text-[#B0B8C8] text-sm">{entry.gwPts}</td>
                      <td className="px-4 py-3 text-right font-black text-[#FFC527]">{entry.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Global Tab ──────────────────────────────────────────────── */}
      {tab === 'global' && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 flex justify-between items-center" style={{ borderBottom: '1px solid #1E2A40' }}>
            <span className="font-bold" style={{ color: '#F5F7FA' }}>Global Rankings</span>
            <div className="flex items-center gap-1.5 text-[#4A5568] text-xs">
              <Globe className="w-3 h-3"/> {globalData.length} managers
            </div>
          </div>
          {globalLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#0057B8]"/>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #1E2A40' }}>
                  <th className="text-left px-4 py-3 text-[#4A5568] text-xs font-semibold">Rank</th>
                  <th className="text-left px-4 py-3 text-[#4A5568] text-xs font-semibold">Team</th>
                  <th className="text-right px-4 py-3 text-[#4A5568] text-xs font-semibold">GW</th>
                  <th className="text-right px-4 py-3 text-[#4A5568] text-xs font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {globalData.map(entry => (
                  <tr key={entry.userId} className="hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: '1px solid #0F1624' }}>
                    <td className="px-4 py-3">
                      {entry.rank <= 3
                        ? MEDAL[entry.rank - 1]
                        : <span className="font-black text-sm text-[#4A5568]">#{entry.rank}</span>}
                    </td>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: '#F5F7FA' }}>{entry.name}</td>
                    <td className="px-4 py-3 text-right text-[#B0B8C8] text-sm">{entry.gwPts}</td>
                    <td className="px-4 py-3 text-right font-black text-[#FFC527]">{entry.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Create League Modal ──────────────────────────────────────── */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={e => e.target === e.currentTarget && closeCreate()}>
          <div className="card w-full max-w-md p-6 animate-fade-in">
            <h2 className="font-black text-xl mb-1" style={{ color: '#F5F7FA' }}>Create League</h2>
            <p className="text-[#B0B8C8] text-sm mb-6">
              {createdLeague ? 'Share the code with friends to invite them' : 'Set up a private league for you and your friends'}
            </p>

            {createdLeague ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl p-4"
                  style={{ background: 'rgba(255,197,39,0.06)', border: '1px solid rgba(255,197,39,0.2)' }}>
                  <div className="text-[#4A5568] text-xs mb-1">League Created · Share this code</div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-lg tracking-widest text-[#FFC527]">{createdLeague.code || '—'}</span>
                    {createdLeague.code && (
                      <button onClick={() => handleCopy(createdLeague.code)}
                        className="flex items-center gap-1 text-xs text-[#B0B8C8] hover:text-white px-2 py-0.5 rounded"
                        style={{ border: '1px solid #2A3654' }}>
                        {copied ? <><Check className="w-3 h-3"/> Copied</> : <><Copy className="w-3 h-3"/> Copy</>}
                      </button>
                    )}
                  </div>
                  <div className="text-[#B0B8C8] text-xs mt-2">{createdLeague.name}</div>
                </div>
                <button onClick={closeCreate} className="btn-primary w-full font-bold">Done</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest text-[#4A5568]">League Name</label>
                  <input className="input" placeholder="My Awesome League"
                    value={newName} onChange={e => setNewName(e.target.value)}/>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest text-[#4A5568]">Type</label>
                  <div className="flex gap-2">
                    {['private', 'public'].map(t => (
                      <button key={t} onClick={() => setNewType(t)}
                        className="flex-1 px-3 py-2 rounded-xl text-sm font-bold capitalize transition-colors"
                        style={newType === t
                          ? { background: '#0057B8', color: '#fff' }
                          : { background: 'rgba(255,255,255,0.03)', color: '#B0B8C8', border: '1px solid #2A3654' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={closeCreate} className="btn-ghost flex-1">Cancel</button>
                  <button className="btn-primary flex-1 font-bold flex items-center justify-center gap-1"
                    disabled={!newName.trim() || creating} onClick={handleCreate}>
                    {creating ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Create'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
