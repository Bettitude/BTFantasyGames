import { useState } from 'react';

function initials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZES = {
  xs: 'w-7 h-7 text-[9px]',
  sm: 'w-9 h-9 text-[10px]',
  md: 'w-11 h-11 text-[11px]',
  lg: 'w-20 h-20 text-xl',
};

export default function PlayerAvatar({ player, size = 'md', bgClass = 'bg-slate-600', className = '' }) {
  const [failed, setFailed] = useState(false);
  const sizeClass = SIZES[size] || SIZES.md;

  if (player?.photo && !failed) {
    return (
      <img
        src={player.photo}
        alt={player.name}
        onError={() => setFailed(true)}
        className={`${sizeClass} rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center font-black text-white shrink-0 ${bgClass} ${className}`}>
      {initials(player?.name)}
    </div>
  );
}
