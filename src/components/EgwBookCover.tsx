import React from 'react';

export interface EgwBookCoverProps {
  title: string;
  abbrev: string;
  year?: number;
  className?: string;
}

// Categorize palette based on title / abbrev
function getCoverTheme(abbrev: string, title: string) {
  const up = abbrev.toUpperCase();
  const t = title.toLowerCase();

  // Conflict of the Ages Series (DA, GC, PP, PK, AA) -> Rich Regal Crimson & Gold
  if (['DA', 'GC', 'PP', 'PK', 'AA'].includes(up)) {
    return {
      bgGradient: 'from-amber-950 via-red-950 to-stone-950',
      border: 'border-amber-500/40',
      accent: '#f59e0b',
      spine: 'from-amber-700/30 to-amber-950/80',
      label: 'CONFLICT OF THE AGES',
    };
  }

  // Testimonies (1T-9T) -> Deep Emerald / Forest Green & Gold
  if (/^[1-9]T$/.test(up)) {
    return {
      bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
      border: 'border-emerald-500/40',
      accent: '#34d399',
      spine: 'from-emerald-700/30 to-emerald-950/80',
      label: 'TESTIMONIES FOR THE CHURCH',
    };
  }

  // Spiritual Gifts & Spirit of Prophecy (1SG-4bSG, 1SP-4SP, EW, ExV) -> Royal Navy / Deep Sapphire & Gold
  if (up.includes('SG') || up.includes('SP') || ['EW', 'EXV', 'EXV54', 'WLF'].includes(up)) {
    return {
      bgGradient: 'from-indigo-950 via-slate-900 to-stone-950',
      border: 'border-indigo-400/40',
      accent: '#818cf8',
      spine: 'from-indigo-700/30 to-indigo-950/80',
      label: 'HISTORICAL & EARLY VISIONS',
    };
  }

  // Practical Christian Living / Health / Education (SC, MB, COL, Ed, MH, CT, CH) -> Rich Auburn / Saddle Leather & Gold
  if (['SC', 'MB', 'COL', 'ED', 'MH', 'CT', 'CH', 'HL', 'CTBH'].includes(up) || t.includes('health') || t.includes('education') || t.includes('christ')) {
    return {
      bgGradient: 'from-stone-900 via-amber-950 to-slate-950',
      border: 'border-amber-600/40',
      accent: '#fbbf24',
      spine: 'from-amber-800/30 to-stone-950/80',
      label: 'CHRISTIAN LIFE & MINISTRY',
    };
  }

  // Default Classic Morocco Leather
  return {
    bgGradient: 'from-slate-900 via-stone-900 to-neutral-950',
    border: 'border-slate-600/40',
    accent: '#d4d4d8',
    spine: 'from-slate-700/30 to-slate-950/80',
    label: 'HISTORICAL WORK',
  };
}

export const EgwBookCover: React.FC<EgwBookCoverProps> = ({
  title,
  abbrev,
  year,
  className = '',
}) => {
  const theme = getCoverTheme(abbrev, title);

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-xl border ${theme.border} bg-gradient-to-b ${theme.bgGradient} transition-transform duration-200 group-hover:scale-[1.03] group-hover:shadow-2xl select-none flex flex-col justify-between ${className}`}
      style={{ aspectRatio: '2 / 3' }}
    >
      {/* 3D Spine Binding Effect on Left Edge */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r ${theme.spine} border-r border-black/40 z-10`}
      />
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10 z-10" />

      {/* Foil Vignette & Leather Sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60 pointer-events-none" />

      {/* Classical Gold Filigree Border SVG (Strictly Classical Victorian Geometrics - No Religious Emblems) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none p-2.5 opacity-60"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 300"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`goldGrad-${abbrev}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#eab308" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Outer Filigree Rect */}
        <rect
          x="12"
          y="10"
          width="176"
          height="280"
          rx="6"
          fill="none"
          stroke={`url(#goldGrad-${abbrev})`}
          strokeWidth="1.2"
        />

        {/* Inner Border Rect */}
        <rect
          x="18"
          y="16"
          width="164"
          height="268"
          rx="4"
          fill="none"
          stroke={`url(#goldGrad-${abbrev})`}
          strokeWidth="0.6"
          strokeDasharray="2, 2"
        />

        {/* Classical Victorian Corner Scroll Ornaments */}
        {/* Top-Left */}
        <path
          d="M 14 26 Q 14 14 26 14"
          fill="none"
          stroke={`url(#goldGrad-${abbrev})`}
          strokeWidth="1.5"
        />
        {/* Top-Right */}
        <path
          d="M 186 26 Q 186 14 174 14"
          fill="none"
          stroke={`url(#goldGrad-${abbrev})`}
          strokeWidth="1.5"
        />
        {/* Bottom-Left */}
        <path
          d="M 14 274 Q 14 286 26 286"
          fill="none"
          stroke={`url(#goldGrad-${abbrev})`}
          strokeWidth="1.5"
        />
        {/* Bottom-Right */}
        <path
          d="M 186 274 Q 186 286 174 286"
          fill="none"
          stroke={`url(#goldGrad-${abbrev})`}
          strokeWidth="1.5"
        />
      </svg>

      {/* Cover Content */}
      <div className="relative z-10 pl-5 pr-3 pt-4 flex flex-col items-center text-center">
        {/* Top Series Label */}
        <div className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase font-semibold text-amber-200/70 mb-2 truncate max-w-full">
          {theme.label}
        </div>

        {/* Central Classical Diamond Emblem */}
        <div className="my-1 flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-400/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="12,2 22,12 12,22 2,12" strokeWidth="1.2" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" strokeWidth="1" fill="currentColor" fillOpacity="0.4" />
          </svg>
        </div>

        {/* Book Title with Classical Typography */}
        <h3 className="font-serif font-bold text-amber-100 text-xs sm:text-sm leading-tight drop-shadow-md px-1 mt-1 line-clamp-3">
          {title}
        </h3>
      </div>

      {/* Bottom Author & Abbrev Strip */}
      <div className="relative z-10 pl-5 pr-3 pb-3 flex flex-col items-center text-center">
        <div className="w-12 h-px bg-amber-400/30 mb-2" />
        <div className="text-[10px] font-serif tracking-wider uppercase text-amber-200/90 font-medium">
          Ellen G. White
        </div>
        <div className="flex items-center space-x-1.5 mt-1 text-[9px] font-mono text-slate-400">
          <span className="font-bold text-amber-400/90 bg-black/40 px-1 rounded">{abbrev}</span>
          {year && <span>• {year}</span>}
        </div>
      </div>
    </div>
  );
};
