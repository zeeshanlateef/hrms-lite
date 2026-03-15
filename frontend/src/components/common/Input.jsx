import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="label">{label}</label>}
      <input
        className={`input dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200 transition-all duration-300 focus:scale-[1.01] ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-tight">{error}</p>}
    </div>
  );
};

export default Input;
