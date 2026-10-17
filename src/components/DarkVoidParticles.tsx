import React from 'react';

export const DarkVoidParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-full bg-slate-950/40 blur-sm"
          style={{
            top: '50%',
            left: '50%',
            animation: `orbit ${8 + i * 2}s linear infinite`,
            transformOrigin: `${30 + i * 10}px 0px`,
          }}
        />
      ))}
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(${60}px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(${60}px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};
