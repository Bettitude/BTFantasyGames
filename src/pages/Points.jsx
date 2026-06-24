import { useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Pitch from '../components/Pitch';
import CountryBadge from '../components/CountryBadge';
import { useTeam } from '../context/TeamContext';
import { POSITION_COLORS } from '../data/formations';
import { api } from '../lib/api';
import { STALE } from '../lib/queryClient';

export default function Points() {
  const { players, starters, bench, captainId, vcId } = useTeam();
  const [gw, setGw] = useState(1);

  const { data: gameweeks = [] } = useQuery({
    queryKey: ['gameweeks'],
    queryFn:  () => api.get('/gameweeks'),
    staleTime: STALE.FIXTURES,
  });

  const { data: pointsData, isLoading: ptsLoading } = useQuery({
    queryKey: ['points', gw],
    queryFn:  () => api.get(`/points/me?gw=${gw}`),
    staleTime: 60_000,
    retry: false,
    enabled: players.length > 0,
  });

  const maxGw = gameweeks.length ? Math.max(...gameweeks.map(g => g.number)) : 3;

  const pointsMap = {};
  const statsMap  = {};
  (pointsData?.players || []).forEach(p => {
    pointsMap[p.playerId] = p.pts;
    statsMap[p.playerId]  = p.stats;
  });
  const totalGwPts = pointsData?.total ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-black mb-1" style={{ color: '#F5F7FA' }}>Points</h1>
        <p className="text-sm text-[#B0B8C8]">Gameweek scores based on real match events</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setGw(g => Math.max(1, g - 1))}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg transition-colors"
          style={{ background: '#1E2A40', color: '#F5F7FA', border: '1px solid #2A3654' }}>‹</button>
        <div className="card px-6 py-2 text-center">
          <div className="text-[#4A5568] text-xs">Gameweek</div>
          <div className="font-black text-xl" style={{ color: '#F5F7FA' }}>{gw}</div>
        </div>
        <button onClick={() => setGw(g => Math.min(maxGw, g + 1))}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg transition-colors"
          style={{ background: '#1E2A40', color: '#F5F7FA', border: '1px solid #2A3654' }}>›</button>
        <div className="card px-5 py-2 ml-4">
          <div className="text-[#4A5568] text-xs">GW Total</div>
          <div className="font-black text-xl" style={{ color: '#FFC527' }}>
            {ptsLoading ? '…' : `${totalGwPts} pts`}
          </div>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="card p-12 text-center">
          <Shield className="w-10 h-10 mx-auto mb-3 text-[#2A3654]" strokeWidth={1}/>
          <div className="font-bold mb-2" style={{ color: '#F5F7FA' }}>No squad selected</div>
          <div className="text-[#B0B8C8] text-sm mb-4">Build your team first to see points.</div>
          <Link to="/build" className="btn-primary px-6 py-2">Build Squad</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Pitch starters={starters} bench={bench}
              captainId={captainId} vcId={vcId}
              pointsMap={pointsMap} readOnly/>
          </div>

          <div className="card overflow-hidden">
            <div className="px-4 py-3 flex justify-between items-center" style={{ borderBottom: '1px solid #1E2A40' }}>
              <span className="font-bold text-sm" style={{ color: '#F5F7FA' }}>Breakdown</span>
              <span className="font-black text-[#FFC527]">{totalGwPts} pts</span>
            </div>
            {ptsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#0057B8]"/>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[500px]">
                {[...players]
                  .sort((a, b) => (pointsMap[b.id] || 0) - (pointsMap[a.id] || 0))
                  .map(p => {
                    const s     = statsMap[p.id] || {};
                    const pts   = pointsMap[p.id] || 0;
                    const isCap = p.id === captainId;
                    const isVC  = p.id === vcId;
                    return (
                      <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                        style={{ borderBottom: '1px solid #0F1624' }}>
                        <CountryBadge code={p.country} size="xs"/>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate flex items-center gap-1" style={{ color: '#F5F7FA' }}>
                            {p.name}
                            {isCap && <span className="text-[#FFC527] text-[9px] font-black ml-1">[C]</span>}
                            {isVC  && <span className="text-[#B0B8C8] text-[9px] font-black ml-1">[VC]</span>}
                          </div>
                          <div className="text-[10px] text-[#4A5568] mt-0.5">
                            {s.minutes    ? `${s.minutes}min` : 'DNP'}
                            {s.goals      ? ` · G${s.goals}`   : ''}
                            {s.assists    ? ` · A${s.assists}` : ''}
                            {s.saves      ? ` · S${s.saves}`   : ''}
                            {s.clean_sheet ? ' · CS' : ''}
                            {isCap ? ' · ×2' : isVC ? ' · ×1.5' : ''}
                          </div>
                        </div>
                        <span className={`badge text-[9px] ${POSITION_COLORS[p.position]?.badge}`}>{p.position}</span>
                        <div className={`font-black text-sm ${pts > 0 ? 'text-[#FFC527]' : 'text-[#4A5568]'}`}>{pts}</div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
