import { useState } from 'react';
import { Bell, Moon, Sun, Menu, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const NOTIFICATIONS = [
  { id: 1, text: 'New order #OQ-0042 received from Table T-6', time: '2m ago' },
  { id: 2, text: 'Order #OQ-0038 is ready to serve', time: '9m ago' },
  { id: 3, text: 'Paneer Tikka is running low on stock', time: '31m ago' },
];

export default function Navbar({ onOpenMobileSidebar }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-secondary-100 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6 dark:border-secondary-700 dark:bg-secondary-900/80">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMobileSidebar} className="rounded-lg p-2 text-secondary-500 hover:bg-secondary-100 lg:hidden dark:hover:bg-secondary-800">
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <p className="font-display text-sm font-semibold text-secondary-900 dark:text-secondary-50">Rasoi Corner Restaurant</p>
          <p className="text-xs text-secondary-400">Chitkara University,hp</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <button onClick={toggleDarkMode} className="rounded-lg p-2 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800" aria-label="Toggle dark mode">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button onClick={() => { setShowNotifs((v) => !v); setShowUserMenu(false); }} className="relative rounded-lg p-2 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800">
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white" />
          </button>
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-secondary-100 bg-white p-2 shadow-lg animate-fade-in dark:border-secondary-700 dark:bg-secondary-800">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-secondary-400">Notifications</p>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="rounded-lg px-3 py-2.5 hover:bg-secondary-50 dark:hover:bg-secondary-700">
                  <p className="text-sm text-secondary-700 dark:text-secondary-100">{n.text}</p>
                  <p className="mt-0.5 text-xs text-secondary-400">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => { setShowUserMenu((v) => !v); setShowNotifs(false); }} className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-secondary-100 dark:hover:bg-secondary-800">
            <img src={user?.avatar || 'https://i.pravatar.cc/150?u=guest'} alt={user?.name} className="h-8 w-8 rounded-full object-cover" />
            <span className="hidden text-sm font-medium text-secondary-700 sm:block dark:text-secondary-100">{user?.name}</span>
            <ChevronDown size={14} className="hidden text-secondary-400 sm:block" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-secondary-100 bg-white p-1.5 shadow-lg animate-fade-in dark:border-secondary-700 dark:bg-secondary-800">
              <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10">
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}