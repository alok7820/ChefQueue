import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ label, error, type = 'text', className, icon: Icon, ...props }, ref) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-secondary-700 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />}
        <input
          ref={ref}
          type={actualType}
          className={cn(
            'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-secondary-800 placeholder:text-secondary-400 transition-colors',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none',
            error ? 'border-danger-400' : 'border-secondary-200',
            Icon && 'pl-9',
            isPassword && 'pr-10',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';
export default Input;
