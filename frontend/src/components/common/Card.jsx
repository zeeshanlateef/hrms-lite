import React from 'react';

const Card = ({ title, value, icon: Icon, colorClass = 'text-primary-600', description, trend }) => {
  return (
    <div className="card-modern p-4 sm:p-6 h-full flex flex-col justify-between group">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 ${colorClass} transition-colors duration-300 group-hover:scale-110 transition-transform`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trend.type === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
            <span>{trend.type === 'up' ? '↑' : '↓'}</span>
            <span>{trend.value}%</span>
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;