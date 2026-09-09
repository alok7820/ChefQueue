import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className }) {
  return (
    <div className={`relative ${className || ''}`}>
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-secondary-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
      />
    </div>
  );
}
