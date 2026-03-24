import React from 'react';

const Input = ({ label, error, className = '', containerClassName = '', icon: Icon, ...props }) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`input-modern ${Icon ? 'pl-11' : ''} ${
            error 
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' 
              : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-semibold text-rose-500 ml-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
