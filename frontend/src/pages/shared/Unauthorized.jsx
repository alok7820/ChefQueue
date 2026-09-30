import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f5] px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-100 text-danger-500">
        <ShieldAlert size={28} />
      </div>
      <h1 className="font-display text-2xl font-bold text-secondary-900">Access restricted</h1>
      <p className="max-w-sm text-sm text-secondary-500">Your role doesn't have permission to view this page. Head back to your dashboard.</p>
      <Link to="/login"><Button>Back to login</Button></Link>
    </div>
  );
}
