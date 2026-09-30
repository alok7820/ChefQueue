import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }).map((_, i) => i + 1).slice(0, 7);

  return (
    <div className="flex items-center justify-between border-t border-secondary-100 px-1 pt-4">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-secondary-600 hover:bg-secondary-100 disabled:opacity-40"
      >
        <ChevronLeft size={16} /> Prev
      </button>
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
              p === page ? 'bg-primary-500 text-white' : 'text-secondary-600 hover:bg-secondary-100'
            )}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-secondary-600 hover:bg-secondary-100 disabled:opacity-40"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
