import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { flagUrl } from '../data/countries';

function TickerMatch({ f }) {
  const isLive = f.status === 'LIVE' || f.status === '1H' || f.status === '2H' || f.status === 'HT';
  const isDone = f.status === 'FT' || f.status === 'AET' || f.status === 'PEN';

  const homeFlagSrc = flagUrl(f.home_code);
  const awayFlagSrc = flagUrl(f.away_code);

  return (
    <div className="flex items-center gap-2 shrink-0 px-4 py-1.5 border-r border-[#1E2A40]">
      {isLive && (
        <span className="text-[9px] font-black text-[#E53935] animate-pulse tracking-widest">LIVE</span>
      )}
      {isDone && (
        <span className="text-[9px] font-bold text-[#4A5568] tracking-widest">FT</span>
      )}
      <div className="flex items-center gap-1.5 text-xs text-[#B0B8C8]">
        {homeFlagSrc
          ? <img src={homeFlagSrc} alt={f.home_code} className="h-3.5 w-5 object-cover rounded-sm"/>
          : <span className="font-bold text-[10px]">{f.home_code}</span>}
        <span className="font-bold text-[#F5F7FA]">{f.home_name ?? f.home_code}</span>
      </div>
      <div className="font-black text-xs px-1.5 py-0.5 rounded"
        style={{ background: (isLive || isDone) ? 'rgba(0,87,184,0.3)' : 'rgba(255,255,255,0.04)', color: '#F5F7FA', minWidth: 32, textAlign: 'center' }}>
        {(isLive || isDone) ? `${f.home_score ?? 0} - ${f.away_score ?? 0}` : fmtTime(f.match_date)}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[#B0B8C8]">
        <span className="font-bold text-[#F5F7FA]">{f.away_name ?? f.away_code}</span>
        {awayFlagSrc
          ? <img src={awayFlagSrc} alt={f.away_code} className="h-3.5 w-5 object-cover rounded-sm"/>
          : <span className="font-bold text-[10px]">{f.away_code}</span>}
      </div>
    </div>
  );
}

function fmtTime(iso) {
  if (!iso) return '--:--';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ScoresTicker() {
  const { data: fixtures = [] } = useQuery({
    queryKey: ['fixtures'],
    queryFn: () => api.get('/fixtures'),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

  const live = fixtures.filter(f =>
    ['LIVE','1H','2H','HT'].includes(f.status)
  );
  const upcoming = fixtures
    .filter(f => f.status === 'NS')
    .slice(0, 8);
  const recent = fixtures
    .filter(f => ['FT','AET','PEN'].includes(f.status))
    .slice(-4);

  const display = [...live, ...upcoming, ...recent];
  if (display.length === 0) return null;

  // Duplicate for seamless loop
  const doubled = [...display, ...display];

  return (
    <div className="overflow-hidden relative"
      style={{ background: '#080E18', borderBottom: '1px solid #1E2A40', height: 36 }}>
      <div className="flex items-center h-full ticker-scroll">
        {doubled.map((f, i) => <TickerMatch key={`${f.id}-${i}`} f={f}/>)}
      </div>
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-8 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #080E18, transparent)' }}/>
      <div className="absolute inset-y-0 right-0 w-8 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #080E18, transparent)' }}/>
    </div>
  );
}
