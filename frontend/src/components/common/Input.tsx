import React, { forwardRef, InputHTMLAttributes, ElementType } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ElementType | string;
  className?: string;
  type?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-zinc-400 pointer-events-none flex items-center justify-center">
            {typeof Icon === 'string' ? (
              <i className={`${Icon} text-xs`}></i>
            ) : (
              <Icon className="w-4 h-4" />
            )}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full bg-white border ${
            error ? 'border-red-500 focus:ring-red-100' : 'border-zinc-200 focus:border-red-500 focus:ring-red-100'
          } rounded-2xl px-4 py-2.5 text-xs font-medium text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 shadow-xs ${
            Icon ? 'pl-10' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
