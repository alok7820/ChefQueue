import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Modal({ open, onClose, title, children, size = 'md', footer }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-secondary-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn('relative w-full rounded-2xl bg-white shadow-2xl animate-fade-in', sizes[size])}>
        <div className="flex items-center justify-between border-b border-secondary-100 px-6 py-4">
          <h3 className="font-display font-semibold text-secondary-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-secondary-100 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
