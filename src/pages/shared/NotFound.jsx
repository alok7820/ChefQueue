import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f5] px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-500">
        <ChefHat size={28} />
      </div>
      <h1 className="font-display text-4xl font-bold text-secondary-900">404</h1>
      <p className="max-w-sm text-sm text-secondary-500">This order got lost on the way to the kitchen. The page you're looking for doesn't exist.</p>
      <Link to="/login"><Button>Back to login</Button></Link>
    </div>
  );
}
