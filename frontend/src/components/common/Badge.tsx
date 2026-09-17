import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'red' | 'studio' | 'emerald' | 'amber' | 'slate' | 'rose';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'red', size = 'sm', className = '' }) => {
  const variants: Record<string, string> = {
    red: 'bg-red-50 text-red-600 border-red-200 font-bold uppercase tracking-wider',
    studio: 'bg-zinc-950 text-white border-zinc-800 font-display font-bold uppercase tracking-wider',
    emerald: 'bg-red-50 text-red-600 border-red-200 font-bold uppercase tracking-wider',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
    rose: 'bg-red-50 text-red-600 border-red-200 font-bold',
    slate: 'bg-zinc-100 text-zinc-700 border-zinc-200 font-bold uppercase'
  };

  const sizes: Record<string, string> = {
    xs: 'px-2 py-0.5 text-[9px]',
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3.5 py-1.5 text-xs'
  };

  return (
    <span
      className={`inline-flex items-center font-bold border rounded-full ${variants[variant] || variants.red} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
