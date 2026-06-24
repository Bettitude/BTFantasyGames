import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Radio, MapPin, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { WC_GROUPS } from '../data/worldCupData';
import CountryBadge from '../components/CountryBadge';
import { STALE } from '../lib/queryClient';

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

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
}

function formatTime(timeStr) {
  return timeStr ? timeStr.slice(0, 5) : '';
}

export default function Fixtures() {
  const [view, setView] = useState('schedule');
  const [gw, setGw]     = useState(1);

  const { data: gameweeks = [], isLoading: gwLoading } = useQuery({
    queryKey: ['gameweeks'],
    queryFn:  () => api.get('/gameweeks'),
    staleTime: STALE.FIXTURES,
  });

  const { data: fixtures = [], isLoading: fxLoading } = useQuery({
    queryKey: ['fixtures'],
    queryFn:  () => api.get('/fixtures'),
    staleTime: STALE.FIXTURES,
  });

  const { data: standings = [] } = useQuery({
    queryKey: ['wc-standings'],
    queryFn:  () => api.get('/sports/standings'),
    staleTime: STALE.STANDINGS,
    enabled:  view === 'groups',
  });

  const isLoading   = gwLoading || fxLoading;
  const gwNumbers   = gameweeks.map(g => g.number);
  const gwFixtures  = fixtures.filter(f => f.gameweeks?.number === gw);

  // Map API-Football standings to group display format, fall back to static
  const groupData = standings.length
    ? standings.map(s => ({
        group: s.league?.name?.replace('Group ', '') || s.group,
        teams: (s.league?.standings?.[0] || []).map(t => ({
          name:  t.team?.name,
          code:  t.team?.name?.slice(0, 3).toUpperCase(),
          played: t.all?.played,
          pts:   t.points,
        })),
      }))
    : WC_GROUPS;

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#0057B8]" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-black mb-1" style={{ color: '#F5F7FA' }}>Fixtures</h1>
        <p className="text-sm text-[#B0B8C8]">FIFA World Cup 2026 — USA, Canada &amp; Mexico</p>
      </div>

      <div className="flex gap-2 mb-6">
        <TabBtn active={view === 'schedule'} onClick={() => setView('schedule')}>Schedule</TabBtn>
        <TabBtn active={view === 'groups'}   onClick={() => setView('groups')}>Group Stage</TabBtn>
      </div>

      {view === 'schedule' && (
        <>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {gwNumbers.map(n => (
              <button key={n} onClick={() => setGw(n)}
                className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                style={gw === n
                  ? { background: '#FFC527', color: '#000' }
                  : { background: 'rgba(255,255,255,0.03)', color: '#B0B8C8', border: '1px solid #2A3654' }}>
                GW {n}
              </button>
            ))}
          </div>

          {gwFixtures.length === 0 ? (
            <p className="text-center text-[#4A5568] py-16">No fixtures for this gameweek yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {gwFixtures.map(f => (
                <div key={f.id} className="card p-5 card-hover">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-[#4A5568] text-xs">
                      <div className="font-semibold">{formatDate(f.match_date)}</div>
                      <div>{formatTime(f.match_time)} UTC</div>
                    </div>
                    {f.status === 'LIVE'
                      ? <span className="flex items-center gap-1 text-xs font-bold badge-live badge"><Radio className="w-3 h-3"/> LIVE</span>
                      : <span className="text-[#4A5568] text-xs font-bold">{f.status === 'FT' ? 'FT' : 'Upcoming'}</span>
                    }
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <CountryBadge code={f.home_code} size="lg"/>
                      <div className="font-bold text-sm" style={{ color: '#F5F7FA' }}>{f.home}</div>
                    </div>
                    <div className="text-center px-4">
                      {f.home_score !== null
                        ? <div className="font-black text-3xl" style={{ color: '#F5F7FA' }}>{f.home_score} – {f.away_score}</div>
                        : <div className="font-black text-xl text-[#2A3654]">VS</div>
                      }
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <CountryBadge code={f.away_code} size="lg"/>
                      <div className="font-bold text-sm" style={{ color: '#F5F7FA' }}>{f.away}</div>
                    </div>
                  </div>
                  {f.venue && (
                    <div className="mt-4 flex items-center justify-center gap-1 text-[#4A5568] text-xs">
                      <MapPin className="w-3 h-3"/><span>{f.venue}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'groups' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupData.map(({ group, teams }) => (
            <div key={group} className="card overflow-hidden">
              <div className="px-4 py-2" style={{ borderBottom: '1px solid #1E2A40', background: 'rgba(0,87,184,0.08)' }}>
                <span className="text-[#0057B8] font-black text-xs tracking-widest">GROUP {group}</span>
              </div>
              {teams.map((t, i) => (
                <div key={t.name} className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < teams.length - 1 ? '1px solid #0F1624' : 'none' }}>
                  <CountryBadge code={t.code} size="sm"/>
                  <span className="flex-1 text-sm font-medium" style={{ color: '#F5F7FA' }}>{t.name}</span>
                  {t.pts !== undefined && (
                    <span className="text-xs text-[#B0B8C8]">{t.played}G · <span className="font-bold text-white">{t.pts}pts</span></span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
