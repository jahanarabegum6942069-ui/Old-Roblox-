import React from 'react';

interface TiltedTowersBackgroundProps {
  opacity?: number;
  showBattleBusSky?: boolean;
}

export const TiltedTowersBackground: React.FC<TiltedTowersBackgroundProps> = ({
  opacity = 0.95,
  showBattleBusSky = true,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-slate-950">
      {/* Primary Tilted Towers Skyline Artwork */}
      <img
        src="/src/assets/images/tilted_towers_backdrop_1792080023303.jpg"
        alt="Tilted Towers Sunset Skyline"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center filter saturate-110 brightness-95"
        style={{ opacity }}
      />

      {/* Atmospheric Twilight & Sunset Gradient Scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/30 via-transparent to-slate-950/90" />

      {/* Animated Mini Battle Bus Drifting across the sky */}
      {showBattleBusSky && (
        <div 
          className="absolute top-12 left-0 pointer-events-none animate-[busFloat_32s_linear_infinite]"
          style={{ willChange: 'transform' }}
        >
          <div className="flex items-center gap-2 transform -scale-x-100 opacity-80 hover:opacity-100 transition-opacity">
            {/* Miniature Hot Air Balloon with Flame */}
            <div className="relative">
              <svg className="w-16 h-20 filter drop-shadow-md" viewBox="0 0 64 80">
                {/* Balloon Body */}
                <defs>
                  <linearGradient id="balloonGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                </defs>
                <path
                  d="M32 4 C16 4, 6 18, 6 32 C6 44, 22 54, 28 58 L36 58 C42 54, 58 44, 58 32 C58 18, 48 4, 32 4 Z"
                  fill="url(#balloonGrad)"
                />
                {/* Ropes */}
                <line x1="26" y1="58" x2="22" y2="66" stroke="#94a3b8" strokeWidth="1" />
                <line x1="38" y1="58" x2="42" y2="66" stroke="#94a3b8" strokeWidth="1" />
                {/* Burner Flame */}
                <ellipse cx="32" cy="62" rx="3" ry="5" fill="#f97316" className="animate-pulse" />
                {/* Bus Silhouette */}
                <rect x="14" y="66" width="36" height="12" rx="3" fill="#0369a1" />
                <rect x="18" y="68" width="6" height="4" rx="1" fill="#bae6fd" />
                <rect x="26" y="68" width="6" height="4" rx="1" fill="#bae6fd" />
                <rect x="34" y="68" width="6" height="4" rx="1" fill="#bae6fd" />
                <circle cx="22" cy="78" r="2.5" fill="#1e293b" />
                <circle cx="42" cy="78" r="2.5" fill="#1e293b" />
              </svg>
              {/* Jet Thruster Glow */}
              <div className="absolute top-16 -right-6 w-8 h-2 bg-gradient-to-r from-cyan-400/80 to-transparent blur-[1px]" />
            </div>
          </div>
        </div>
      )}

      {/* Floating subtle cloud specks */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(244,114,182,0.15),transparent_50%)]" />

      <style>{`
        @keyframes busFloat {
          0% {
            transform: translateX(-120px) translateY(20px);
          }
          50% {
            transform: translateX(50vw) translateY(5px);
          }
          100% {
            transform: translateX(calc(100vw + 120px)) translateY(15px);
          }
        }
      `}</style>
    </div>
  );
};
