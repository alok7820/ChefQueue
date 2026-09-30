import { ChefHat } from 'lucide-react';

export default function Spinner({ label = 'Loading...', full = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${full ? 'h-[60vh]' : 'py-10'}`}>
      <ChefHat className="animate-pulse text-primary-500" size={32} />
      <p className="text-sm text-secondary-500">{label}</p>
    </div>
  );
}
