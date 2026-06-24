import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, X, Info, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTeam } from '../context/TeamContext';
import { INITIAL_BUDGET } from '../data/worldCupData';
import { FORMATIONS, POSITION_LIMITS } from '../data/formations';
import { api } from '../lib/api';
import Pitch from '../components/Pitch';
import CountryBadge from '../components/CountryBadge';
import { formatPrice, formatBudget } from '../utils/pointsCalculator';
import { STALE } from '../lib/queryClient';
import { matchesCountry } from '../data/countries';

const POS_TAG = {
  GK: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  DF: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  MF: 'bg-[#0057B8]/20 text-blue-300 border border-blue-500/30',
  FW: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
};

export default function TeamBuilder() {
  const { players, formation, captainId, vcId, starters, bench, budget, dispatch, saveSquad } = useTeam();
  const navigate  = useNavigate();
  const [posFilter, setPosFilter]   = useState('ALL');
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('price_fc');
  const [notification, setNotification] = useState(null);
  const [saving, setSaving]         = useState(false);

  const { data: allPlayers = [], isLoading: playersLoading } = useQuery({
    queryKey: ['players'],
    queryFn:  () => api.get('/players'),
    staleTime: STALE.PLAYERS,
  });

  function notify(msg, type = 'error') {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }

  function addPlayer(player) {
    if (players.find(p => p.id === player.id))
      { notify('Already in squad'); return; }
    if (players.length >= 15)
      { notify('Squad is full (15 players max)'); return; }
    if (player.price_fc > budget)
      { notify('Not enough budget'); return; }
    if (players.filter(p => p.position === player.position).length >= POSITION_LIMITS[player.position])
      { notify(`Max ${POSITION_LIMITS[player.position]} ${player.position}s reached`); return; }
    if (players.filter(p => p.country === player.country).length >= 3)
      { notify(`Max 3 players from ${player.country}`); return; }
    dispatch({ type: 'ADD_PLAYER', payload: player });
    notify(`${player.name} added`, 'success');
  }

  function removePlayer(id) { dispatch({ type: 'REMOVE_PLAYER', payload: id }); }

  function handleSelectStarter(id) {
    if (!captainId)                     dispatch({ type: 'SET_CAPTAIN',      payload: id });
    else if (!vcId && id !== captainId) dispatch({ type: 'SET_VICE_CAPTAIN', payload: id });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveSquad();
      navigate('/my-team');
    } catch {
      notify('Failed to save squad. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const filtered = allPlayers
    .filter(p => {
      if (posFilter !== 'ALL' && p.position !== posFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !matchesCountry(p.country, search)) return false;
      return true;
    })
    .sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0));

  const budgetPct = ((INITIAL_BUDGET - budget) / INITIAL_BUDGET) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-bold shadow-xl flex items-center gap-2
          ${notification.type === 'success' ? 'bg-[#00C853] text-black' : 'bg-[#E53935] text-white'}`}>
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
          {notification.msg}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-black mb-1" style={{ color: '#F5F7FA' }}>Build Your Squad</h1>
        <p className="text-sm text-[#B0B8C8]">Pick 15 players · {players.length}/15 · {formatBudget(budget)} remaining</p>
      </div>

      {/* Budget bar */}
      <div className="card p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#B0B8C8] text-xs font-bold uppercase tracking-widest">Budget</span>
          <span className="font-black text-sm" style={{ color: '#FFC527' }}>{formatBudget(budget)} left</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1E2A40' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${budgetPct}%`, background: budgetPct > 90 ? '#E53935' : budgetPct > 70 ? '#FFC527' : '#0057B8' }}/>
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-[#4A5568]">
          <span>0M</span><span>100M FC</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* ── PITCH ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {Object.keys(FORMATIONS).map(f => (
              <button key={f} onClick={() => dispatch({ type: 'SET_FORMATION', payload: f })}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={formation === f
                  ? { background: '#0057B8', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.03)', color: '#B0B8C8', border: '1px solid #2A3654' }}>
                {f}
              </button>
            ))}
          </div>

          <Pitch starters={starters} bench={bench}
            captainId={captainId} vcId={vcId}
            onSelectStarter={handleSelectStarter}
            onRemove={removePlayer}/>

          {(captainId || vcId) && (
            <div className="mt-3 card p-3 flex items-center gap-2 text-xs">
              <Info className="w-3 h-3 text-[#0057B8] shrink-0"/>
              <span className="text-[#B0B8C8]">
                Captain scores <span className="font-black text-[#FFC527]">2×</span>,
                vice-captain <span className="font-bold text-white">1.5×</span> if captain can't play
              </span>
            </div>
          )}

          {players.length === 15 && (
            <button onClick={handleSave} disabled={saving}
              className="btn-primary w-full mt-4 py-3 font-black flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4"/>}
              {saving ? 'Saving…' : 'Save Squad'}
            </button>
          )}
        </div>

        {/* ── PLAYER LIST ───────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          {/* Position limits */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {Object.entries(POSITION_LIMITS).map(([pos, max]) => {
              const current = players.filter(p => p.position === pos).length;
              return (
                <div key={pos} className="shrink-0 card px-3 py-1.5 text-xs font-bold flex items-center gap-1.5">
                  <span className="text-[#4A5568]">{pos}</span>
                  <span style={{ color: current >= max ? '#E53935' : current > 0 ? '#FFC527' : '#F5F7FA' }}>
                    {current}/{max}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mb-3 flex-wrap">
            {['ALL','GK','DF','MF','FW'].map(pos => (
              <button key={pos} onClick={() => setPosFilter(pos)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={posFilter === pos
                  ? { background: '#0057B8', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.03)', color: '#B0B8C8', border: '1px solid #2A3654' }}>
                {pos}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <input className="input py-1.5 text-xs flex-1"
              placeholder="Search player or country…" value={search} onChange={e => setSearch(e.target.value)}/>
            <select className="input py-1.5 text-xs w-auto"
              value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="price_fc">Price ↓</option>
              <option value="total_pts">Points ↓</option>
              <option value="form">Form ↓</option>
              <option value="selection_pct">Selected% ↓</option>
            </select>
          </div>
          <div className="text-[#4A5568] text-xs mb-2">{filtered.length} players</div>

          <div className="card overflow-hidden max-h-[580px] overflow-y-auto">
            {playersLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#0057B8]"/>
              </div>
            ) : filtered.map(player => {
              const inSquad = !!players.find(p => p.id === player.id);
              const isCap   = captainId === player.id;
              const isVC    = vcId === player.id;
              return (
                <div key={player.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: '1px solid #0F1624' }}>
                  <CountryBadge code={player.country} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate" style={{ color: '#F5F7FA' }}>{player.name}</span>
                      {isCap && <span className="badge badge-captain text-[9px]">C</span>}
                      {isVC  && <span className="badge bg-slate-500/20 text-slate-300 border-slate-500/30 text-[9px]">VC</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`badge text-[9px] ${POS_TAG[player.position]}`}>{player.position}</span>
                      <span className="text-[10px] text-[#4A5568]">{player.total_pts} pts · {player.selection_pct}% sel</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-sm" style={{ color: '#F5F7FA' }}>{formatPrice(player.price_fc)}</div>
                    {inSquad ? (
                      <div className="flex gap-1 mt-1">
                        <button onClick={() => dispatch({ type: 'SET_CAPTAIN', payload: player.id })}
                          className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black"
                          style={{ background: isCap ? '#FFC527' : '#1E2A40', color: isCap ? '#000' : '#B0B8C8' }}>C</button>
                        <button onClick={() => dispatch({ type: 'SET_VICE_CAPTAIN', payload: player.id })}
                          className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black"
                          style={{ background: isVC ? '#0057B8' : '#1E2A40', color: '#fff' }}>V</button>
                        <button onClick={() => removePlayer(player.id)}
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-[#E53935]/10"
                          style={{ background: '#1E2A40', color: '#E53935' }}>
                          <X className="w-3 h-3"/>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => addPlayer(player)}
                        className="mt-1 px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ background: 'rgba(0,87,184,0.2)', color: '#0057B8', border: '1px solid rgba(0,87,184,0.4)' }}>
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
