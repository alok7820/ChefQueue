import { Moon, Bell, Globe, Palette } from 'lucide-react';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const COLORS = [
  { name: 'orange', hex: '#F97316' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'green', hex: '#22c55e' },
  { name: 'violet', hex: '#8b5cf6' },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-secondary-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0'}`} />
    </button>
  );
}

function Row({ icon: Icon, title, description, control }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-500">
          <Icon size={17} />
        </div>
        <div>
          <p className="text-sm font-medium text-secondary-800">{title}</p>
          <p className="text-xs text-secondary-500">{description}</p>
        </div>
      </div>
      {control}
    </div>
  );
}

export default function Settings() {
  const { darkMode, toggleDarkMode, themeColor, setThemeColor } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-xl font-bold text-secondary-900">Settings</h1>
      <p className="mt-1 text-sm text-secondary-500">Personalize how ChefQueue looks and notifies you.</p>

      <Card className="mt-6 divide-y divide-secondary-100">
        <Row icon={Moon} title="Dark mode" description="Switch to a low-light interface" control={<Toggle checked={darkMode} onChange={toggleDarkMode} />} />
        <Row icon={Bell} title="Notifications" description="Get alerts for new and updated orders"
          control={<Toggle checked={notifications} onChange={(v) => { setNotifications(v); toast.success(v ? 'Notifications on' : 'Notifications off'); }} />} />
        <Row icon={Globe} title="Language" description="Interface display language"
          control={<Select className="w-36" value={language} onChange={(e) => setLanguage(e.target.value)}
            options={[{ value: 'en', label: 'English' }]} />} />
      </Card>
    </div>
  );
}
