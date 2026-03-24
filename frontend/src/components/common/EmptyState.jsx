import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = PackageOpen, 
  title = "No data found", 
  description = "We couldn't find any records matching your criteria.",
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mb-6 border border-slate-200 dark:border-slate-700/50">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium mb-8">
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
