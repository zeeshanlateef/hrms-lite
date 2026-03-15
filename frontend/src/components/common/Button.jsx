import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false, 
  disabled = false, 
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };

  return (
    <button
      className={`btn ${variants[variant]} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
      )}
      {!loading && Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;
