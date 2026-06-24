import { POSITION_COLORS } from '../data/formations';
import PlayerAvatar from './PlayerAvatar';

function PlayerToken({ slot, captainId, vcId, onSelect, onRemove, pointsMap, readOnly }) {
  const { player, pos, x, y } = slot;
  const col   = POSITION_COLORS[pos] || POSITION_COLORS.ANY;
  const isCap = player && player.id === captainId;
  const isVc  = player && player.id === vcId;
  const pts   = player && pointsMap ? pointsMap[player.id] : undefined;

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={() => !readOnly && player && onSelect && onSelect(player.id)}>
      <div className="flex flex-col items-center gap-0.5 cursor-pointer">
        <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center relative overflow-hidden
          ${player ? `${col.bg} border-white/30` : 'bg-[#0d1a0f] border-dashed border-[#2A3654]'}`}>
          {player
            ? <PlayerAvatar player={player} size="md" bgClass={col.bg}/>
            : <span className={`text-[10px] font-bold ${col.text}`}>{pos}</span>}
          {isCap && <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFC527] rounded-full flex items-center justify-center text-black font-black text-[9px]">C</div>}
          {isVc && !isCap && <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-400 rounded-full flex items-center justify-center text-black font-black text-[9px]">V</div>}
        </div>
        {player ? (
          <div className="rounded px-1.5 py-0.5 text-center max-w-[72px]" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="text-white text-[9px] font-bold truncate leading-tight">
              {player.name.split(' ').pop()}
            </div>
            {pts !== undefined && (
              <div className="text-[#00C853] text-[9px] font-bold">{pts} pts</div>
            )}
          </div>
        ) : (
          <div className="rounded px-1 py-0.5" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <span className="text-[#2A3654] text-[9px]">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}

function BenchRow({ bench, captainId, vcId, onRemove, readOnly }) {
  if (!bench || bench.length === 0) return null;
  return (
    <div className="flex justify-around mt-2 px-2 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2A40' }}>
      {bench.map(slot => {
        const { player, pos, label } = slot;
        const col = POSITION_COLORS[pos] || POSITION_COLORS.ANY;
        const isCap = player && player.id === captainId;
        const isVc  = player && player.id === vcId;
        return (
          <div key={slot.id} className="flex flex-col items-center gap-0.5">
            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center relative overflow-hidden opacity-70
              ${player ? `${col.bg} border-white/20` : 'bg-[#0d1a0f] border-dashed border-[#2A3654]'}`}>
              {player
                ? <PlayerAvatar player={player} size="sm" bgClass={col.bg}/>
                : <span className={`text-[9px] font-bold ${col.text}`}>{pos === 'ANY' ? '?' : pos}</span>}
              {isCap && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#FFC527] rounded-full flex items-center justify-center text-black font-black text-[7px]">C</div>}
              {isVc && !isCap && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-slate-400 rounded-full flex items-center justify-center text-black font-black text-[7px]">V</div>}
            </div>
            <div className="text-[9px] text-[#4A5568] text-center leading-tight max-w-[56px]">
              {player ? player.name.split(' ').pop() : label}
            </div>
            {!readOnly && player && onRemove && (
              <button onClick={e => { e.stopPropagation(); onRemove(player.id); }}
                className="text-[8px] text-[#E53935] hover:text-[#ff6b6b] font-bold">✕</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Pitch({
  starters  = [],
  bench     = [],
  captainId = null,
  vcId      = null,
  onSelectStarter,
  onRemove,
  pointsMap = {},
  readOnly  = false,
}) {
  return (
    <div>
      {/* Pitch */}
      <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '135%' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a2e0f 0%, #0d3a14 40%, #0a2e0f 100%)' }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 135" preserveAspectRatio="none">
            <rect x="5"  y="3"   width="90" height="129" fill="none" stroke="#1e4a24" strokeWidth="0.5"/>
            <line x1="5" y1="67.5" x2="95" y2="67.5" stroke="#1e4a24" strokeWidth="0.4"/>
            <circle cx="50" cy="67.5" r="12" fill="none" stroke="#1e4a24" strokeWidth="0.4"/>
            <circle cx="50" cy="67.5" r="0.8" fill="#1e4a24"/>
            <rect x="22" y="3"   width="56" height="20"  fill="none" stroke="#1e4a24" strokeWidth="0.4"/>
            <rect x="33" y="3"   width="34" height="10"  fill="none" stroke="#1e4a24" strokeWidth="0.4"/>
            <rect x="22" y="112" width="56" height="20"  fill="none" stroke="#1e4a24" strokeWidth="0.4"/>
            <rect x="33" y="122" width="34" height="10"  fill="none" stroke="#1e4a24" strokeWidth="0.4"/>
            {[0,2,4,6,8].map(i => (
              <rect key={i} x="5" y={3 + i * 14.3} width="90" height="14.3" fill="#0d3216" opacity="0.3"/>
            ))}
          </svg>
        </div>
        {starters.map(slot => (
          <PlayerToken key={slot.id} slot={slot}
            captainId={captainId} vcId={vcId}
            onSelect={onSelectStarter}
            onRemove={onRemove}
            pointsMap={pointsMap}
            readOnly={readOnly}/>
        ))}
      </div>

      {/* Bench */}
      <BenchRow bench={bench} captainId={captainId} vcId={vcId} onRemove={onRemove} readOnly={readOnly}/>
    </div>
  );
}
