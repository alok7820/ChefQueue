export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-secondary-100 bg-white p-5">
      <div className="skeleton h-4 w-24 rounded-md" />
      <div className="skeleton mt-3 h-8 w-32 rounded-md" />
      <div className="skeleton mt-2 h-3 w-20 rounded-md" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-secondary-50 px-4 py-3">
      <div className="skeleton h-4 w-full rounded-md" />
    </div>
  );
}
