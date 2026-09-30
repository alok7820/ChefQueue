import { Outlet } from 'react-router-dom';
import { ChefHat, Sparkles } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white">
              <ChefHat size={20} />
            </div>
            <span className="font-display text-lg font-bold text-secondary-900">ChefQueue</span>
          </div>
          <Outlet />
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-secondary-900 lg:block">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, #F97316 0%, transparent 40%), radial-gradient(circle at 80% 80%, #F97316 0%, transparent 40%)'
        }} />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-primary-300">
            <Sparkles size={13} /> Built for busy kitchens
          </div>
          <div>
            <p className="font-display text-4xl font-bold leading-tight text-white">
              Every ticket,<br />tracked from<br /><span className="text-primary-400">fire to plate.</span>
            </p>
            <p className="mt-4 max-w-md text-secondary-400">
              ChefQueue keeps admins, chefs and cashiers on the same page — live order status, kitchen load, and revenue in one queue.
            </p>
          </div>
          <p className="font-mono-ticket text-xs text-secondary-500">© 2026 ChefQueue Systems</p>
        </div>
      </div>
    </div>
  );
}
