import { Link } from 'react-router-dom';
import { Star, RefreshCw, Users } from 'lucide-react';
import { useTeam } from '../context/TeamContext';
import { INITIAL_BUDGET } from '../data/worldCupData';
import Pitch from '../components/Pitch';
import CountryBadge from '../components/CountryBadge';
import { formatPrice, formatBudget } from '../utils/pointsCalculator';

const POS_TAG = {
  GK: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  DF: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  MF: 'bg-[#0057B8]/20 text-blue-300 border border-blue-500/30',
  FW: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
};

export default function MyTeam() {
  const { players, formation, captainId, vcId, starters, bench, budget } = useTeam();

  const spent   = INITIAL_BUDGET - budget;
  const captain = players.find(p => p.id === captainId);
  const vc      = players.find(p => p.id === vcId);

  if (players.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(0,87,184,0.1)', border: '1px solid rgba(0,87,184,0.3)' }}>
          <Users className="w-10 h-10 text-[#0057B8]"/>
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#F5F7FA' }}>No squad yet</h2>
        <p className="text-[#B0B8C8] mb-6">Build your 15-player squad to get started.</p>
        <Link to="/build" className="btn-primary px-8 py-3">Build Squad</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black mb-1" style={{ color: '#F5F7FA' }}>My Team</h1>
          <p className="text-sm text-[#B0B8C8]">{formation} · {players.length}/15 players</p>
        </div>
        <Link to="/build" className="btn-blue flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl">
          <RefreshCw className="w-3.5 h-3.5"/> Edit Squad
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Formation',   value: formation },
          { label: 'Budget Used', value: formatPrice(spent) },
          { label: 'Remaining',   value: formatBudget(budget), gold: true },
          { label: 'Players',     value: `${players.length}/15` },
        ].map(({ label, value, gold }) => (
          <div key={label} className="card p-4 text-center">
            <div className="font-black text-xl" style={{ color: gold ? '#FFC527' : '#F5F7FA' }}>{value}</div>
            <div className="text-[#4A5568] text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Pitch starters={starters} bench={bench} captainId={captainId} vcId={vcId} readOnly/>
        </div>

        <div className="lg:col-span-3">
          {(captain || vc) && (
            <div className="card p-4 mb-4 flex gap-4">
              {captain && (
                <div className="flex-1">
                  <div className="text-[10px] font-black text-[#FFC527] uppercase tracking-widest mb-1">Captain</div>
                  <div className="flex items-center gap-2">
                    <CountryBadge code={captain.country} size="sm"/>
                    <span className="font-bold text-sm" style={{ color: '#F5F7FA' }}>{captain.name}</span>
                    <Star className="w-3 h-3 text-[#FFC527]" fill="currentColor"/>
                  </div>
                </div>
              )}
              {vc && (
                <div className="flex-1">
                  <div className="text-[10px] font-black text-[#B0B8C8] uppercase tracking-widest mb-1">Vice Captain</div>
                  <div className="flex items-center gap-2">
                    <CountryBadge code={vc.country} size="sm"/>
                    <span className="font-bold text-sm" style={{ color: '#F5F7FA' }}>{vc.name}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest mb-2">Starting XI</div>
          <div className="card overflow-hidden mb-4">
            {starters.map(slot => {
              const p = slot.player;
              if (!p) return (
                <div key={slot.id} className="flex items-center gap-3 px-4 py-3 opacity-40"
                  style={{ borderBottom: '1px solid #0F1624' }}>
                  <div className="w-7 h-7 rounded-full border-2 border-dashed border-[#2A3654] flex items-center justify-center">
                    <span className="text-[9px] text-[#4A5568]">{slot.pos}</span>
                  </div>
                  <span className="text-[#4A5568] text-sm">Empty</span>
                </div>
              );
              const isCap = p.id === captainId, isVC = p.id === vcId;
              return (
                <div key={slot.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: '1px solid #0F1624' }}>
                  <CountryBadge code={p.country} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm truncate" style={{ color: '#F5F7FA' }}>{p.name}</span>
                      {isCap && <span className="badge badge-captain text-[9px]">C</span>}
                      {isVC  && <span className="badge bg-slate-500/20 text-slate-300 border-slate-500/30 text-[9px]">VC</span>}
                    </div>
                    <span className={`badge text-[9px] ${POS_TAG[p.position]}`}>{p.position}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#FFC527]">{formatPrice(p.price_fc)}</div>
                    <div className="text-[10px] text-[#4A5568]">{p.total_pts} pts</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest mb-2">Bench</div>
          <div className="card overflow-hidden">
            {bench.map(slot => {
              const p = slot.player;
              if (!p) return (
                <div key={slot.id} className="flex items-center gap-3 px-4 py-3 opacity-40"
                  style={{ borderBottom: '1px solid #0F1624' }}>
                  <span className="text-[#4A5568] text-sm">{slot.label}</span>
                </div>
              );
              return (
                <div key={slot.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors opacity-70"
                  style={{ borderBottom: '1px solid #0F1624' }}>
                  <CountryBadge code={p.country} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm truncate" style={{ color: '#F5F7FA' }}>{p.name}</span>
                    <div><span className={`badge text-[9px] ${POS_TAG[p.position]}`}>{p.position}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#B0B8C8]">{formatPrice(p.price_fc)}</div>
                    <div className="text-[10px] text-[#4A5568]">{p.total_pts} pts</div>
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
