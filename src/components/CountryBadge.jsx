import { useState } from 'react';
import { flagUrl, countryName } from '../data/countries';

const PALETTE = ['#1e6bd9','#d92b1e','#1ea84a','#d9841e','#8e1ed9','#1ea8d9','#d9c21e','#d91e8e'];

function bgColor(code = 'XX') {
  const hash = (code || 'XX').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
}

const SIZE = {
  xs: { img: 'h-4 w-6',   fallback: 'w-6 h-4 text-[7px]'  },
  sm: { img: 'h-5 w-7',   fallback: 'w-7 h-5 text-[8px]'  },
  md: { img: 'h-6 w-9',   fallback: 'w-9 h-6 text-[9px]'  },
  lg: { img: 'h-8 w-12',  fallback: 'w-12 h-8 text-[10px]' },
};

export default function CountryBadge({ code, size = 'md', className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const s    = SIZE[size] || SIZE.md;
  const src  = flagUrl(code);
  const name = countryName(code);

  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={name || code}
        title={name || code}
        className={`${s.img} rounded-sm object-cover shrink-0 ${className}`}
        onError={() => setImgFailed(true)}
      />
    );
  }

  // Fallback: colored badge with 3-letter code
  return (
    <div
      title={name || code}
      className={`${s.fallback} rounded-sm flex items-center justify-center font-black text-white tracking-wide shrink-0 ${className}`}
      style={{ background: bgColor(code) }}>
      {(code || '??').slice(0, 3).toUpperCase()}
    </div>
  );
}
