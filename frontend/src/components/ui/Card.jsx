import { cn } from '../../utils/cn';

export default function Card({ children, className, hover = false, padded = true }) {
  return (
    <div className={cn(
      'rounded-2xl border border-secondary-100 bg-white shadow-sm',
      hover && 'transition-shadow hover:shadow-md',
      padded && 'p-5',
      className
    )}>
      {children}
    </div>
  );
}
