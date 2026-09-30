import { cn } from '../../utils/cn';

const STATUS_STYLES = {
  Pending: 'bg-warning-100 text-warning-700',
  Preparing: 'bg-primary-100 text-primary-700',
  Ready: 'bg-blue-100 text-blue-700',
  Completed: 'bg-success-100 text-success-700',
  Cancelled: 'bg-danger-100 text-danger-700',
  Paid: 'bg-success-100 text-success-700',
  Unpaid: 'bg-danger-100 text-danger-700',
  Refunded: 'bg-secondary-100 text-secondary-600',
  High: 'bg-danger-100 text-danger-700',
  Normal: 'bg-secondary-100 text-secondary-600',
  Low: 'bg-success-100 text-success-700',
  Active: 'bg-success-100 text-success-700',
  Inactive: 'bg-secondary-100 text-secondary-500',
};

export default function Badge({ children, tone, className }) {
  const style = STATUS_STYLES[children] || STATUS_STYLES[tone] || 'bg-secondary-100 text-secondary-600';
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', style, className)}>
      {children}
    </span>
  );
}
