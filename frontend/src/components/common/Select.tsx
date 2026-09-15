import React, { forwardRef, SelectHTMLAttributes, ElementType } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  icon?: ElementType;
  className?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options = [],
  error,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <select
          ref={ref}
          className={`w-full bg-white border ${
            error ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
          } rounded-xl px-4 py-2.5 text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:ring-4 shadow-sm appearance-none pr-10 cursor-pointer ${
            Icon ? 'pl-11' : ''
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
