import React from 'react';

const Loader = ({ fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated logo ring */}
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping" />
        {/* Inner ring */}
        <div className="relative w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 border-r-primary-400 animate-spin" />
        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
            <span className="text-white font-black text-sm">H</span>
          </div>
        </div>
      </div>

      {/* Brand text + dots */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-widest uppercase">
          HRMS<span className="text-primary-500">·</span>Lite
        </p>
        {/* Staggered dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary-500"
              style={{
                animation: 'loaderBounce 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes loaderBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-50/90 dark:bg-[#020617]/90 backdrop-blur-sm z-[9999] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {content}
    </div>
  );
};

export default Loader;
