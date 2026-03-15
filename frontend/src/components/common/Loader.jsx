import React from 'react';

const Loader = ({ fullPage = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-primary-100 dark:border-primary-900/30 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Loading Intelligence...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md z-[9999] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="p-12 flex items-center justify-center">
      {spinner}
    </div>
  );
};

export default Loader;
