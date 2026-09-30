import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Select = forwardRef(({ label, error, options = [], className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-secondary-700 mb-1.5">{label}</label>}
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-sm text-secondary-800 transition-colors',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none',
          error ? 'border-danger-400' : 'border-secondary-200',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
        ))}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400" />
    </div>
    {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
  </div>
));
Select.displayName = 'Select';
export default Select;
