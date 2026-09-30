import { RowSkeleton } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';
import { useState, useMemo } from 'react';

export default function DataTable({ columns, data, loading, pageSize = 8, emptyTitle = 'No records found' }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const rows = useMemo(() => data.slice((page - 1) * pageSize, page * pageSize), [data, page, pageSize]);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-secondary-100">
        {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
      </div>
    );
  }

  if (!data.length) return <EmptyState title={emptyTitle} description="Try adjusting your filters or search." />;

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-secondary-100">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-secondary-100 bg-secondary-50/60">
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium text-secondary-500">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? i} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50">
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-4 py-3.5 text-secondary-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
