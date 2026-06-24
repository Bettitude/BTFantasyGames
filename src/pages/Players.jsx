import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import CountryBadge from '../components/CountryBadge';
import { STALE } from '../lib/queryClient';
import { matchesCountry } from '../data/countries';
import PlayerAvatar from '../components/PlayerAvatar';

const POS_TAG = {
  GK: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  DF: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  MF: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  FW: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};
const POS_BG = { GK: 'bg-amber-500', DF: 'bg-sky-500', MF: 'bg-[#0057B8]', FW: 'bg-rose-500' };

const SORT_OPTIONS = [
  { value: 'total_pts',    label: 'Total Points' },
  { value: 'price_fc',     label: 'Price'        },
  { value: 'form',         label: 'Form'         },
  { value: 'selection_pct', label: 'Selected By' },
];

function formatPrice(fc) {
  if (!fc) return '—';
  return `${(fc / 1_000_000).toFixed(1)}M`;
}

function ActiveBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className="px-4 py-2 rounded-xl text-xs font-bold transition-colors"
      style={active
        ? { background: '#0057B8', color: '#fff' }
        : { background: 'rgba(255,255,255,0.03)', color: '#B0B8C8', border: '1px solid #2A3654' }
      }>
      {children}
    </button>
  );
}

export default function Players() {
  const [posFilter, setPosFilter] = useState('ALL');
  const [search, setSearch]       = useState('');
  const [sortBy, setSortBy]       = useState('total_pts');
  const [sortDir, setSortDir]     = useState('desc');

  const { data: players = [], isLoading } = useQuery({
    queryKey: ['players'],
    queryFn:  () => api.get('/players'),
    staleTime: STALE.PLAYERS,
  });

  const filtered = useMemo(() => {
    let list = players.filter(p => {
      if (posFilter !== 'ALL' && p.position !== posFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !matchesCountry(p.country, search)) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sortDir === 'desc' ? (b[sortBy] ?? 0) - (a[sortBy] ?? 0) : (a[sortBy] ?? 0) - (b[sortBy] ?? 0)
    );
    return list;
  }, [players, posFilter, search, sortBy, sortDir]);

  function toggleSort(col) {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(col); setSortDir('desc'); }
  }

  const SortTh = ({ col, label }) => (
    <th className="text-right px-4 py-3 text-xs font-semibold cursor-pointer select-none text-[#4A5568] hover:text-[#FFC527]"
      onClick={() => toggleSort(col)}>
      {label} {sortBy === col ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#0057B8]" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-black mb-1" style={{ color: '#F5F7FA' }}>Players</h1>
        <p className="text-sm text-[#B0B8C8]">World Cup 2026 — {players.length} players</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input className="input sm:max-w-xs" placeholder="Search player or country…"
          value={search} onChange={e => setSearch(e.target.value)}/>
        <div className="flex gap-2 flex-wrap">
          {['ALL','GK','DF','MF','FW'].map(pos => (
            <ActiveBtn key={pos} active={posFilter === pos} onClick={() => setPosFilter(pos)}>{pos}</ActiveBtn>
          ))}
        </div>
        <div className="sm:ml-auto">
          <select className="input w-auto py-2" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="text-[#4A5568] text-xs mb-3">{filtered.length} players found</div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead style={{ borderBottom: '1px solid #1E2A40' }}>
            <tr>
              <th className="text-left px-4 py-3 text-[#4A5568] text-xs font-semibold">Player</th>
              <th className="text-left px-4 py-3 text-[#4A5568] text-xs font-semibold">Nation</th>
              <SortTh col="price_fc"      label="Price"/>
              <SortTh col="selection_pct" label="Sel%"/>
              <SortTh col="form"          label="Form"/>
              <SortTh col="total_pts"     label="Pts"/>
              <th className="text-right px-4 py-3"/>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group"
                style={{ borderBottom: '1px solid #0F1624' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <PlayerAvatar player={p} size="sm" bgClass={POS_BG[p.position]}/>
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[7px] font-black ${POS_BG[p.position]}`}>
                        {p.position[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#F5F7FA' }}>{p.name}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {(p.weekly_pts || []).slice(-3).map((pt, i) => (
                          <span key={i} className="text-[10px] text-[#4A5568] px-1 rounded"
                            style={{ background: '#0F1624' }}>{pt}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><CountryBadge code={p.country} size="sm"/></td>
                <td className="px-4 py-3 text-right font-bold text-sm" style={{ color: '#F5F7FA' }}>{formatPrice(p.price_fc)}</td>
                <td className="px-4 py-3 text-right text-[#B0B8C8] text-sm">{p.selection_pct}%</td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-sm font-bold ${p.form >= 8 ? 'text-[#00C853]' : p.form >= 6 ? 'text-[#FFC527]' : 'text-[#B0B8C8]'}`}>
                    {p.form}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-black text-[#FFC527]">{p.total_pts}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/players/${p.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-[#FFC527]"/>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
