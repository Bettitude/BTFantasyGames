import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Shield, Wallet, LogOut, Menu, X, Search, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import { formatBudget } from '../utils/pointsCalculator';
import { api } from '../lib/api';

const WC_START = new Date('2026-06-14T16:00:00Z');

function useCountdown() {
  const [diff, setDiff] = useState(WC_START - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(WC_START - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d}d ${h}h ${m}m ${sec}s`;
}

function useNotifications(user) {
  const [notifs, setNotifs]   = useState([]);
  const [unread, setUnread]   = useState(0);

  useEffect(() => {
    if (!user) return;

    function fetchNotifs() {
      api.get('/notifications')
        .then(data => {
          setNotifs(data ?? []);
          setUnread((data ?? []).filter(n => !n.is_read).length);
        })
        .catch(() => {});
    }

    fetchNotifs();
    // Poll for new notifications since there's no server push channel
    const id = setInterval(fetchNotifs, 15000);
    return () => clearInterval(id);
  }, [user]);

  function markRead() {
    api.patch('/notifications/read', {}).catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnread(0);
  }

  return { notifs, unread, markRead };
}

const NAV_LINKS = [
  { to: '/',          label: 'Home'      },
  { to: '/build',     label: 'Build'     },
  { to: '/my-team',   label: 'My Team'   },
  { to: '/transfers', label: 'Transfers' },
  { to: '/points',    label: 'Points'    },
  { to: '/players',   label: 'Players'   },
  { to: '/leagues',   label: 'Leagues'   },
  { to: '/fixtures',  label: 'Fixtures'  },
  { to: '/chat',      label: 'Chat'      },
];

export default function Navbar() {
  const { user, signOut }       = useAuth();
  const { budget }              = useTeam();
  const countdown               = useCountdown();
  const { notifs, unread, markRead } = useNotifications(user);
  const navigate                = useNavigate();
  const [open, setOpen]         = useState(false);
  const [searchQ, setSearchQ]   = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef                = useRef(null);

  // Close notifications dropdown on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate('/auth/login');
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ('');
      setOpen(false);
    }
  }

  function openNotifs() {
    setNotifOpen(o => !o);
    if (!notifOpen && unread > 0) markRead();
  }

  function fmtNotifTime(iso) {
    const d = new Date(iso);
    const diff = Date.now() - d;
    if (diff < 60000)  return 'just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  return (
    <nav className="sticky top-0 z-50" style={{ background: '#0B0F19', borderBottom: '1px solid #1E2A40' }}>
      {/* Countdown ticker */}
      {countdown && (
        <div className="text-xs font-bold text-center py-1 tracking-widest uppercase"
          style={{ background: 'linear-gradient(90deg, #0057B8, #1a6fd4)', color: '#fff' }}>
          World Cup 2026 kicks off in {countdown}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 flex items-center h-14 gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-8 h-8">
            <Shield className="w-8 h-8 text-[#0057B8]" fill="#0057B8" strokeWidth={0}/>
            <span className="absolute inset-0 flex items-center justify-center text-[#FFC527] font-black text-[10px] tracking-tight">BT</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-black text-sm tracking-tight leading-none">BT Fantasy</div>
            <div className="text-[#FFC527] text-[9px] font-bold tracking-widest leading-none mt-0.5">FOOTBALL</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#0057B8]/20 text-[#FFC527] font-semibold' : 'text-[#B0B8C8] hover:text-white hover:bg-white/5'
                }`}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Search bar (desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-1.5 rounded-xl px-3 py-1.5 flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #2A3654', width: 200 }}>
          <Search className="w-3.5 h-3.5 text-[#4A5568] shrink-0"/>
          <input
            className="bg-transparent text-xs text-[#B0B8C8] placeholder-[#4A5568] outline-none flex-1 min-w-0"
            placeholder="Search…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs shrink-0"
              style={{ background: 'rgba(255,197,39,0.08)', border: '1px solid rgba(255,197,39,0.2)' }}>
              <Wallet className="w-3 h-3 text-[#FFC527]"/>
              <span className="text-[#FFC527] font-black">{formatBudget(budget)}</span>
            </div>
          )}

          {/* Chat icon */}
          <Link to="/chat" className="relative p-2 rounded-lg text-[#B0B8C8] hover:text-white hover:bg-white/5 transition-colors">
            <MessageSquare className="w-5 h-5"/>
          </Link>

          {/* Notification bell */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button onClick={openNotifs}
                className="relative p-2 rounded-lg text-[#B0B8C8] hover:text-white hover:bg-white/5 transition-colors">
                <Bell className="w-5 h-5"/>
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
                    style={{ background: '#E53935', color: '#fff' }}>
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: '#0F1624', border: '1px solid #1E2A40' }}>
                  <div className="px-4 py-3 font-black text-sm" style={{ borderBottom: '1px solid #1E2A40', color: '#F5F7FA' }}>
                    Notifications
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <div className="px-4 py-8 text-center text-[#4A5568] text-sm">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20"/>
                        No notifications yet
                      </div>
                    ) : notifs.map(n => (
                      <div key={n.id}
                        className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                        style={{ borderBottom: '1px solid #0F1624', opacity: n.is_read ? 0.6 : 1 }}
                        onClick={() => { if (n.link) navigate(n.link); setNotifOpen(false); }}>
                        <div className="flex items-start gap-2">
                          {!n.is_read && (
                            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: '#0057B8' }}/>
                          )}
                          <div className={!n.is_read ? '' : 'ml-4'}>
                            <p className="text-xs text-[#F5F7FA] leading-snug">{n.message}</p>
                            <p className="text-[10px] text-[#4A5568] mt-0.5">{fmtNotifTime(n.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User avatar / Sign in */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile"
                className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0"
                style={{ background: '#0057B8' }}>
                {user.email?.[0]?.toUpperCase() ?? 'U'}
              </Link>
              <button onClick={handleSignOut}
                className="hidden sm:flex items-center gap-1 text-xs text-[#4A5568] hover:text-[#E53935] transition-colors">
                <LogOut className="w-3 h-3"/> Sign out
              </button>
            </div>
          ) : (
            <Link to="/auth/login" className="btn-primary text-sm px-4 py-1.5">Sign In</Link>
          )}

          <button className="lg:hidden text-[#B0B8C8] hover:text-white p-1" onClick={() => setOpen(o => !o)}>
            {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden px-4 py-3 flex flex-col gap-1" style={{ borderTop: '1px solid #1E2A40', background: '#0B0F19' }}>
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4A5568]"/>
              <input className="input pl-9 py-2 text-sm w-full" placeholder="Search…"
                value={searchQ} onChange={e => setSearchQ(e.target.value)}/>
            </div>
            <button type="submit" className="btn-primary px-4 py-2 text-sm">Go</button>
          </form>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-[#FFC527] bg-[#0057B8]/15' : 'text-[#B0B8C8] hover:text-white'}`
              }>
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
