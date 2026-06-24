import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, User, Trophy, Loader2 } from 'lucide-react';
import CountryBadge from '../components/CountryBadge';
import { api } from '../lib/api';
import { formatPrice } from '../utils/pointsCalculator';

const POS_COLOR = { GK: '#FFC527', DF: '#38BDF8', MF: '#0057B8', FW: '#E53935' };

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [input, setInput]   = useState(q);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInput(q);
    if (!q || q.length < 2) { setResults(null); return; }
    setLoading(true);
    api.get(`/search?q=${encodeURIComponent(q)}`)
      .then(data => setResults(data))
      .catch(() => setResults({ players: [], leagues: [] }))
      .finally(() => setLoading(false));
  }, [q]);

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) setParams({ q: input.trim() });
  }

  const hasResults = results && (results.players.length > 0 || results.leagues.length > 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]"/>
          <input
            autoFocus
            className="input pl-9 py-3 text-base w-full"
            placeholder="Search players, countries, leagues…"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary px-6 py-3 font-bold">Search</button>
      </form>

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#0057B8]"/>
        </div>
      )}

      {!loading && q && !hasResults && (
        <div className="text-center text-[#4A5568] py-16">
          <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-20"/>
          <p className="text-lg font-bold text-[#B0B8C8]">No results for "{q}"</p>
          <p className="text-sm mt-1">Try a player name, country, or league name</p>
        </div>
      )}

      {!loading && hasResults && (
        <div className="space-y-6">
          {results.players.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-[#0057B8]"/>
                <h2 className="font-black text-sm uppercase tracking-widest text-[#B0B8C8]">
                  Players ({results.players.length})
                </h2>
              </div>
              <div className="card divide-y divide-[#0F1624]">
                {results.players.map(p => (
                  <Link key={p.id} to={`/players/${p.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                    <CountryBadge code={p.country} size="sm"/>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate" style={{ color: '#F5F7FA' }}>{p.name}</div>
                      <div className="text-xs text-[#4A5568]">{p.country}</div>
                    </div>
                    <span className="text-xs font-black px-2 py-0.5 rounded"
                      style={{ background: `${POS_COLOR[p.position]}20`, color: POS_COLOR[p.position] }}>
                      {p.position}
                    </span>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold" style={{ color: '#F5F7FA' }}>{formatPrice(p.price_fc)}</div>
                      <div className="text-xs text-[#FFC527] font-bold">{p.total_pts} pts</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.leagues.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-[#FFC527]"/>
                <h2 className="font-black text-sm uppercase tracking-widest text-[#B0B8C8]">
                  Leagues ({results.leagues.length})
                </h2>
              </div>
              <div className="card divide-y divide-[#0F1624]">
                {results.leagues.map(l => (
                  <Link key={l.id} to="/leagues"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(255,197,39,0.1)' }}>
                      <Trophy className="w-4 h-4 text-[#FFC527]"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ color: '#F5F7FA' }}>{l.name}</div>
                      <div className="text-xs text-[#4A5568] uppercase">{l.type}</div>
                    </div>
                    {l.code && (
                      <span className="text-xs font-mono text-[#4A5568] tracking-wider">{l.code}</span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {!q && (
        <div className="text-center text-[#4A5568] py-16">
          <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-20"/>
          <p className="text-[#B0B8C8] font-bold">Search the World Cup 2026 fantasy</p>
          <p className="text-sm mt-1">Find players by name or country, or look up leagues</p>
        </div>
      )}
    </div>
  );
}
