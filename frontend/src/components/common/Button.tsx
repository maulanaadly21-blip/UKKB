import React, { ButtonHTMLAttributes, ReactNode, ElementType } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ElementType | string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants: Record<string, string> = {
    primary: 'bg-red-600 hover:bg-red-500 text-white shadow-red-glow focus:ring-red-500',
    secondary: 'bg-zinc-950 hover:bg-zinc-800 text-white focus:ring-zinc-700 shadow-md',
    outline: 'border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-900 focus:ring-red-500 shadow-xs',
    ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:ring-zinc-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };

  const sizes: Record<string, string> = {
    xs: 'px-3 py-1.5 text-[10px] gap-1',
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-7 py-3.5 text-sm gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        typeof Icon === 'string' ? (
          <i className={`${Icon} text-xs`}></i>
        ) : (
          <Icon className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'}`} />
        )
      ) : null}
      {children}
    </button>
  );
};

export default Button;
