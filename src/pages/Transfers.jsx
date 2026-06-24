import { useState, useMemo, useEffect } from 'react';
import { Clock, ArrowLeftRight, X, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import CountryBadge from '../components/CountryBadge';
import { useTeam } from '../context/TeamContext';
import { POSITION_COLORS } from '../data/formations';
import { api } from '../lib/api';
import { matchesCountry } from '../data/countries';
import { formatPrice } from '../utils/pointsCalculator';
import { STALE } from '../lib/queryClient';

const DEADLINE = new Date('2026-06-20T11:00:00Z');

function useDeadline() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = DEADLINE - now;
  if (diff <= 0) return 'Closed';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${d}d ${h}h ${m}m`;
}

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

export default function Transfers() {
  const { players, budget, dispatch } = useTeam();
  const deadline = useDeadline();
  const [removing, setRemoving]   = useState(null);
  const [posFilter, setPosFilter] = useState('ALL');
  const [search, setSearch]       = useState('');
  const [sortBy, setSortBy]       = useState('price_fc');

  const { data: allPlayers = [], isLoading } = useQuery({
    queryKey: ['players'],
    queryFn:  () => api.get('/players'),
    staleTime: STALE.PLAYERS,
  });

  const squadIds = new Set(players.map(p => p.id));

  const replacements = useMemo(() => allPlayers.filter(p => {
    if (squadIds.has(p.id)) return false;
    if (removing && p.position !== removing.position) return false;
    if (posFilter !== 'ALL' && p.position !== posFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !matchesCountry(p.country, search)) return false;
    if (removing && p.price_fc > budget + removing.price_fc) return false;
    return true;
  }).sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0)), [removing, posFilter, search, sortBy, squadIds, budget, allPlayers]);

  function doTransfer(inPlayer) {
    if (!removing) return;
    // Optimistic update — fire-and-forget server sync
    api.post('/squad/transfer', { playerInId: inPlayer.id, playerOutId: removing.id }).catch(() => {});
    dispatch({ type: 'REMOVE_PLAYER', payload: removing.id });
    dispatch({ type: 'ADD_PLAYER',    payload: inPlayer });
    setRemoving(null);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black mb-1" style={{ color: '#F5F7FA' }}>Transfers</h1>
          <p className="text-sm text-[#B0B8C8]">Swap players in and out of your squad</p>
        </div>
        <div className="flex gap-3">
          <div className="card px-4 py-2 text-center">
            <div className="text-[#4A5568] text-xs">Budget Left</div>
            <div className="font-black text-lg" style={{ color: '#FFC527' }}>{formatPrice(budget)}</div>
          </div>
          <div className="card px-4 py-2 text-center">
            <div className="flex items-center gap-1 text-[#4A5568] text-xs justify-center">
              <Clock className="w-3 h-3"/> Deadline
            </div>
            <div className="font-black text-sm" style={{ color: '#E53935' }}>{deadline}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Squad */}
        <div>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wide text-[#B0B8C8]">
            {removing ? `Replace: ${removing.name}` : 'Select player to transfer out'}
          </h2>
          {removing && (
            <div className="mb-3 rounded-xl px-4 py-2 flex items-center gap-2 text-sm"
              style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.25)' }}>
              <ArrowLeftRight className="w-4 h-4 shrink-0" style={{ color: '#E53935' }}/>
              <span className="font-bold" style={{ color: '#F5F7FA' }}>{removing.name}</span>
              <span className="text-[#B0B8C8]">({formatPrice(removing.price_fc)})</span>
              <button onClick={() => setRemoving(null)} className="ml-auto text-[#4A5568] hover:text-white">
                <X className="w-4 h-4"/>
              </button>
            </div>
          )}
          <div className="card overflow-hidden">
            {players.length === 0 ? (
              <div className="p-8 text-center text-[#B0B8C8] text-sm">No squad yet. Build your team first.</div>
            ) : players.map(p => {
              const isOut = removing?.id === p.id;
              return (
                <div key={p.id} onClick={() => !removing && setRemoving(p)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/[0.02]"
                  style={{
                    borderBottom: '1px solid #0F1624',
                    ...(isOut ? { background: 'rgba(229,57,53,0.06)', borderLeft: '2px solid #E53935' } : {}),
                  }}>
                  <CountryBadge code={p.country} size="xs"/>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: '#F5F7FA' }}>{p.name}</div>
                    <div className="text-xs text-[#4A5568]">{p.country}</div>
                  </div>
                  <span className={`badge text-[9px] ${POSITION_COLORS[p.position]?.badge}`}>{p.position}</span>
                  <span className="text-[#B0B8C8] text-xs">{formatPrice(p.price_fc)}</span>
                  <span className="font-bold text-xs text-[#FFC527]">{p.total_pts}pts</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Replacement pool */}
        <div>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wide text-[#B0B8C8]">Available Players</h2>
          <div className="flex gap-2 mb-2 flex-wrap">
            {['ALL','GK','DF','MF','FW'].map(pos => (
              <TabBtn key={pos} active={posFilter === pos} onClick={() => setPosFilter(pos)}>{pos}</TabBtn>
            ))}
          </div>
          <div className="flex gap-2 mb-2">
            <input className="input flex-1 py-1.5 text-xs"
              placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}/>
            <select className="input py-1.5 text-xs w-auto"
              value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="price_fc">Price ↓</option>
              <option value="total_pts">Points ↓</option>
              <option value="form">Form ↓</option>
            </select>
          </div>
          <div className="text-[#4A5568] text-xs mb-2">{replacements.length} available</div>
          <div className="card overflow-y-auto max-h-[500px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#0057B8]"/>
              </div>
            ) : replacements.length === 0 ? (
              <div className="p-8 text-center text-[#B0B8C8] text-sm">
                {removing ? 'No affordable replacements in this position' : 'Select a player to transfer out first'}
              </div>
            ) : replacements.map(p => {
              const delta = removing ? p.price_fc - removing.price_fc : 0;
              return (
                <div key={p.id} onClick={() => removing && doTransfer(p)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors
                    ${removing ? 'cursor-pointer hover:bg-white/[0.02]' : 'opacity-50 cursor-default'}`}
                  style={{ borderBottom: '1px solid #0F1624' }}>
                  <CountryBadge code={p.country} size="xs"/>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: '#F5F7FA' }}>{p.name}</div>
                    <div className="text-xs text-[#4A5568]">{p.country}</div>
                  </div>
                  <span className={`badge text-[9px] ${POSITION_COLORS[p.position]?.badge}`}>{p.position}</span>
                  <span className="font-bold text-xs" style={{ color: '#F5F7FA' }}>{formatPrice(p.price_fc)}</span>
                  <span className="font-bold text-xs text-[#FFC527]">{p.total_pts}pts</span>
                  {removing && (
                    <span className={`text-[10px] font-bold ${delta <= 0 ? 'text-[#00C853]' : 'text-[#E53935]'}`}>
                      {delta <= 0 ? '▼' : '▲'}{formatPrice(Math.abs(delta))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
