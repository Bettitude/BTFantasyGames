import { Link } from 'react-router-dom';
import { Shield, Twitter, Instagram, Youtube, Facebook } from 'lucide-react';

const QUICK_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/players',  label: 'Players'  },
  { to: '/fixtures', label: 'Fixtures' },
  { to: '/leagues',  label: 'Leagues'  },
  { to: '/chat',     label: 'Chat Room'},
];

const GAME_LINKS = [
  { to: '/build',     label: 'Build Your Squad' },
  { to: '/my-team',  label: 'My Team'           },
  { to: '/transfers', label: 'Transfers'         },
  { to: '/points',   label: 'Points'             },
];

const SOCIAL = [
  { Icon: Twitter,   href: '#', label: 'Twitter'   },
  { Icon: Instagram, href: '#', label: 'Instagram'  },
  { Icon: Facebook,  href: '#', label: 'Facebook'   },
  { Icon: Youtube,   href: '#', label: 'YouTube'    },
];

export default function Footer() {
  return (
    <footer style={{ background: '#080E18', borderTop: '1px solid #1E2A40' }}>
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="relative w-9 h-9 shrink-0">
              <Shield className="w-9 h-9 text-[#0057B8]" fill="#0057B8" strokeWidth={0}/>
              <span className="absolute inset-0 flex items-center justify-center text-[#FFC527] font-black text-[11px] tracking-tight">BT</span>
            </div>
            <div>
              <div className="text-white font-black text-base tracking-tight leading-none">BT Fantasy</div>
              <div className="text-[#FFC527] text-[9px] font-bold tracking-widest leading-none mt-0.5">FOOTBALL</div>
            </div>
          </Link>
          <p className="text-xs text-[#4A5568] leading-relaxed mb-5">
            The official Bettitude Fantasy Football platform for the FIFA World Cup 2026. Craft your squad, compete with the world, and rise to the top.
          </p>
          <p className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: '#FFC527' }}>
            "Crafting legends, one pick at a time"
          </p>

          {/* Social icons */}
          <div className="flex gap-3 mt-5">
            {SOCIAL.map(({ Icon, href, label }) => (
              <a key={label} href={href} aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[#0057B8]"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#4A5568' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#4A5568'}>
                <Icon className="w-4 h-4"/>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#F5F7FA' }}>Explore</h3>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to}
                  className="text-sm text-[#4A5568] hover:text-[#FFC527] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Game Links */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#F5F7FA' }}>Play</h3>
          <ul className="space-y-2.5">
            {GAME_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to}
                  className="text-sm text-[#4A5568] hover:text-[#FFC527] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company + Newsletter */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#F5F7FA' }}>Company</h3>
          <ul className="space-y-2.5 mb-6">
            {['About Bettitude', 'Contact Us', 'Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(label => (
              <li key={label}>
                <a href="#" className="text-sm text-[#4A5568] hover:text-[#FFC527] transition-colors">{label}</a>
              </li>
            ))}
          </ul>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#F5F7FA' }}>
              Newsletter
            </h4>
            <p className="text-xs text-[#4A5568] mb-3">Get tips, fixtures & updates in your inbox.</p>
            <form onSubmit={e => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="input text-xs py-2 flex-1 min-w-0"
              />
              <button type="submit"
                className="px-3 py-2 rounded-xl text-xs font-bold shrink-0"
                style={{ background: '#0057B8', color: '#fff' }}>
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: '#1E2A40' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#4A5568]">
            © {new Date().getFullYear()} Bettitude Inc. All rights reserved.
          </p>
          <p className="text-xs text-[#4A5568]">
            Powered by{' '}
            <span className="font-bold" style={{ color: '#0057B8' }}>BTFantasy</span>
            {' '}· World Cup 2026 Edition
          </p>
        </div>
      </div>
    </footer>
  );
}
