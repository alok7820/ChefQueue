import { ServerCrash } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-100 text-danger-500">
        <ServerCrash size={24} />
      </div>
      <div>
        <p className="font-display font-semibold text-secondary-800">Couldn't load this</p>
        <p className="mt-1 text-sm text-secondary-500">{message}</p>
      </div>
      {onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
