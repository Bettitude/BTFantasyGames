import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import CountryBadge from '../components/CountryBadge';
import { POSITION_COLORS } from '../data/formations';
import { formatPrice } from '../utils/pointsCalculator';
import { STALE } from '../lib/queryClient';

export default function PlayerDetail() {
  const { id } = useParams();

  const { data: player, isLoading, isError } = useQuery({
    queryKey: ['player', id],
    queryFn:  () => api.get(`/players/${id}`),
    staleTime: STALE.PLAYERS,
    retry: false,
  });

  const { data: fixtures = [] } = useQuery({
    queryKey: ['fixtures'],
    queryFn:  () => api.get('/fixtures'),
    staleTime: STALE.FIXTURES,
    enabled:  !!player,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#0057B8]" />
    </div>
  );

  if (isError || !player) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in">
        <BarChart2 className="w-12 h-12 mx-auto mb-4 text-[#2A3654]" strokeWidth={1}/>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#F5F7FA' }}>Player not found</h2>
        <Link to="/players" className="flex items-center gap-1 justify-center text-[#FFC527] hover:text-[#e6a800]">
          <ArrowLeft className="w-4 h-4"/> Back to Players
        </Link>
      </div>
    );
  }

  const col       = POSITION_COLORS[player.position] || POSITION_COLORS.ANY;
  const weeklyPts = player.weekly_pts || [];
  const maxPts    = weeklyPts.length ? Math.max(...weeklyPts) : 1;

  // Aggregate season stats from player_gw_stats
  const stats = (player.player_gw_stats || []).reduce(
    (acc, s) => ({
      appearances: acc.appearances + (s.minutes > 0 ? 1 : 0),
      goals:       acc.goals + s.goals,
      assists:     acc.assists + s.assists,
      cleanSheets: acc.cleanSheets + (s.clean_sheet ? 1 : 0),
      yellowCards: acc.yellowCards + s.yellow_cards,
      redCards:    acc.redCards + s.red_cards,
    }),
    { appearances: 0, goals: 0, assists: 0, cleanSheets: 0, yellowCards: 0, redCards: 0 }
  );

  // Country-specific upcoming fixtures, fallback to any upcoming
  const countryFixtures = fixtures.filter(
    f => f.status === 'NS' && (f.home_code === player.country || f.away_code === player.country)
  );
  const upcomingFixtures = (countryFixtures.length ? countryFixtures : fixtures.filter(f => f.status === 'NS')).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/players" className="inline-flex items-center gap-1 text-sm text-[#B0B8C8] hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4"/> Players
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6 flex flex-col sm:flex-row items-start gap-6">
        <div className={`w-20 h-20 rounded-2xl ${col.bg} flex items-center justify-center shrink-0`}>
          <span className="text-white font-black text-xl">
            {player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-black" style={{ color: '#F5F7FA' }}>{player.name}</h1>
            <span className={`badge text-xs ${col.badge}`}>{player.position}</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <CountryBadge code={player.country} size="xs"/>
            <span className="text-[#B0B8C8] text-sm">{player.country}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              ['Price',     formatPrice(player.price_fc)],
              ['Total Pts', String(player.total_pts)],
              ['Form',      Number(player.form).toFixed(1)],
              ['Selected',  `${player.selection_pct}%`],
            ].map(([label, val]) => (
              <div key={label}>
                <div className="text-[#4A5568] text-xs mb-0.5">{label}</div>
                <div className="font-black text-lg" style={{ color: '#F5F7FA' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Points history */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-[#FFC527]"/>
            <h3 className="font-bold text-sm uppercase tracking-wide" style={{ color: '#F5F7FA' }}>Points History</h3>
          </div>
          {weeklyPts.length === 0 ? (
            <p className="text-[#4A5568] text-sm py-8 text-center">No points data yet</p>
          ) : (
            <div className="flex items-end gap-1.5 h-24">
              {weeklyPts.map((pts, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[10px] text-[#4A5568]">{pts}</div>
                  <div className="w-full rounded-t-sm transition-all"
                    style={{
                      height:    `${(pts / maxPts) * 100}%`,
                      minHeight: '4px',
                      background: pts === maxPts ? '#FFC527' : '#1E2A40',
                    }}/>
                  <div className="text-[9px] text-[#4A5568]">GW{i + 1}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming fixtures */}
        <div className="card p-5">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wide" style={{ color: '#F5F7FA' }}>Upcoming Fixtures</h3>
          {upcomingFixtures.length === 0 ? (
            <p className="text-[#4A5568] text-sm py-8 text-center">No upcoming fixtures</p>
          ) : (
            <div className="flex flex-col gap-2">
              {upcomingFixtures.map(f => (
                <div key={f.id} className="flex items-center gap-2 py-2"
                  style={{ borderBottom: '1px solid #0F1624' }}>
                  <CountryBadge code={f.home_code} size="xs"/>
                  <span className="font-semibold text-xs" style={{ color: '#F5F7FA' }}>{f.home}</span>
                  <span className="text-[#4A5568] text-xs mx-auto">vs</span>
                  <span className="font-semibold text-xs" style={{ color: '#F5F7FA' }}>{f.away}</span>
                  <CountryBadge code={f.away_code} size="xs"/>
                  {f.match_date && (
                    <span className="text-[#4A5568] text-[10px] ml-1">
                      {new Date(f.match_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Season stats */}
        <div className="card p-5 sm:col-span-2">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wide" style={{ color: '#F5F7FA' }}>Season Statistics</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {[
              ['Apps',    stats.appearances],
              ['Goals',   stats.goals],
              ['Assists', stats.assists],
              ['CS',      (player.position === 'GK' || player.position === 'DF') ? stats.cleanSheets : '—'],
              ['Yellows', stats.yellowCards],
              ['Reds',    stats.redCards],
            ].map(([label, val]) => (
              <div key={label} className="text-center">
                <div className="font-black text-xl" style={{ color: '#F5F7FA' }}>{val}</div>
                <div className="text-[#4A5568] text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
