import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, UtensilsCrossed, ClipboardList, BarChart3, Users, Settings,
  ChefHat, ListChecks, User, PlusCircle, Receipt, Wallet, Sparkles, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const MENUS = {
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ],
  chef: [
    { to: '/chef/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/chef/queue', label: 'Kitchen Queue', icon: ListChecks },
    { to: '/chef/completed', label: 'Completed Orders', icon: ClipboardList },
    { to: '/chef/ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { to: '/chef/profile', label: 'Profile', icon: User },
  ],
  cashier: [
    { to: '/cashier/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cashier/new-order', label: 'New Order', icon: PlusCircle },
    { to: '/cashier/orders', label: 'Orders', icon: Receipt },
    { to: '/cashier/payments', label: 'Payments', icon: Wallet },
    { to: '/cashier/ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { to: '/cashier/profile', label: 'Profile', icon: User },
  ],
};

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { user } = useAuth();
  const items = MENUS[user?.role] || [];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-secondary-900/50 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-secondary-100 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white">
              <ChefHat size={19} />
            </div>
            <div>
              <p className="font-display text-[15px] font-bold leading-none text-secondary-900">ChefQueue</p>
              <p className="mt-1 text-[11px] font-mono-ticket uppercase tracking-wider text-secondary-400">{user?.role}</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="text-secondary-400 lg:hidden"><X size={20} /></button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-primary-50 text-primary-600' : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              )}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-secondary-100 p-4">
          <div className="rounded-xl bg-secondary-50 p-3.5">
            <p className="text-xs font-medium text-secondary-700">Kitchen status</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success-500" />
              <span className="text-xs text-secondary-500">All stations online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
