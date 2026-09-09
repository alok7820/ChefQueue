import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-400">
        <Icon size={24} />
      </div>
      <div>
        <p className="font-display font-semibold text-secondary-800">{title}</p>
        {description && <p className="mt-1 text-sm text-secondary-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
