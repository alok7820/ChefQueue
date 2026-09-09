import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm shadow-primary-500/20',
  secondary: 'bg-secondary-800 text-white hover:bg-secondary-900',
  outline: 'border border-secondary-200 text-secondary-700 hover:bg-secondary-50 bg-white',
  ghost: 'text-secondary-600 hover:bg-secondary-100',
  danger: 'bg-danger-500 text-white hover:bg-danger-600',
  success: 'bg-success-500 text-white hover:bg-success-600',
};

const sizes = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2',
};

export default function Button({
  children, variant = 'primary', size = 'md', className, icon: Icon,
  loading = false, disabled = false, type = 'button', ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}
