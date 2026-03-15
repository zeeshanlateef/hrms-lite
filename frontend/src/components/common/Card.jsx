import React from 'react';

const Card = ({ title, value, icon: Icon, colorClass = 'bg-primary-50 text-primary-600', description }) => {
  return (
    <div className="card glass hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{value}</h3>
          {description && (
            <div className="flex items-center gap-1.5 opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">{description}</p>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl shadow-sm ${colorClass} transition-colors duration-300`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default Card;