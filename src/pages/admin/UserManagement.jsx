import { useState, useMemo } from 'react';
import { Trash2, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/tables/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useFetch } from '../../hooks/useFetch';
import { useDebounce } from '../../hooks/useDebounce';
import { userService } from '../../services/userService';

const ROLES = ['All', 'admin', 'chef', 'cashier'];

export default function UserManagement() {
  const { data: users, loading, refetch } = useFetch(() => userService.getAll(), []);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [role, setRole] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => (role === 'All' || u.role === role) && u.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [users, role, debouncedSearch]);

  const toggleStatus = async (u) => {
    await userService.update(u.id, { status: u.status === 'Active' ? 'Inactive' : 'Active' });
    toast.success(`${u.name} is now ${u.status === 'Active' ? 'inactive' : 'active'}`);
    refetch();
  };

  const handleDelete = async () => {
    await userService.remove(deleteTarget.id);
    toast.success('User removed');
    setDeleteTarget(null);
    refetch();
  };

  const columns = [
    { key: 'name', header: 'User', render: (r) => (
      <div className="flex items-center gap-2.5">
        <img src={r.avatar} alt={r.name} className="h-8 w-8 rounded-full object-cover" />
        <div><p className="font-medium text-secondary-800">{r.name}</p><p className="text-xs text-secondary-400">{r.email}</p></div>
      </div>
    ) },
    { key: 'role', header: 'Role', render: (r) => <span className="capitalize">{r.role}</span> },
    { key: 'phone', header: 'Phone' },
    { key: 'status', header: 'Status', render: (r) => (
      <button onClick={() => toggleStatus(r)}><Badge>{r.status}</Badge></button>
    ) },
    { key: 'actions', header: 'Actions', render: (r) => (
      <button onClick={() => setDeleteTarget(r)} className="rounded-lg p-1.5 text-danger-500 hover:bg-danger-50"><Trash2 size={15} /></button>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-secondary-900">Users</h1>
          <p className="mt-1 text-sm text-secondary-500">Manage staff accounts and roles.</p>
        </div>
        <div className="hidden items-center gap-2 rounded-xl bg-secondary-100 px-3 py-2 text-xs text-secondary-500 sm:flex">
          <UserCog size={14} /> {users?.length || 0} team members
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search users..." className="sm:max-w-xs" />
        <Select value={role} onChange={(e) => setRole(e.target.value)} options={ROLES} className="sm:max-w-[180px]" />
      </div>

      <Card padded={false} className="p-4">
        <DataTable columns={columns} data={filtered} loading={loading} pageSize={8} />
      </Card>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Remove this user?" description={`${deleteTarget?.name} will lose access to ChefQueue.`} />
    </div>
  );
}
