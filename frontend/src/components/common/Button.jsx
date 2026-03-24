import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false, 
  disabled = false, 
  icon: Icon,
  size = 'md',
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-rose-600/20',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm rounded-lg',
    md: 'btn-base',
    lg: 'h-14 px-8 text-lg rounded-2xl',
  };

  return (
    <button
      className={`font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : 18} strokeWidth={2.5} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
