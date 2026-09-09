import { cn } from '../../utils/cn';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, trend, trendUp = true, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    secondary: 'bg-secondary-100 text-secondary-600',
  };
  return (
    <div className="rounded-2xl border border-secondary-100 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tones[tone])}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className={cn('flex items-center gap-0.5 text-xs font-medium', trendUp ? 'text-success-600' : 'text-danger-600')}>
            {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-secondary-900">{value}</p>
      <p className="mt-0.5 text-sm text-secondary-500">{label}</p>
    </div>
  );
}
