import { useState, useMemo } from 'react';
import { Trash2, UserCog, X } from 'lucide-react';
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
  const [showAddUser, setShowAddUser] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'chef',
  });

  const { data: users, loading, refetch } = useFetch(
    () => userService.getAll(),
    []
  );

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  const [role, setRole] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // -----------------------------
  // CREATE USER
  // -----------------------------
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      await userService.create(newUser);

      toast.success(
        `${newUser.role === 'chef' ? 'Chef' : 'Cashier'} created successfully`
      );

      setNewUser({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'chef',
      });

      setShowAddUser(false);
      refetch();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Could not create user'
      );
    }
  };

  // -----------------------------
  // FILTER USERS
  // -----------------------------
  const filtered = useMemo(() => {
    if (!users) return [];

    return users.filter(
      (u) =>
        (role === 'All' || u.role === role) &&
        u.name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
    );
  }, [users, role, debouncedSearch]);

  // -----------------------------
  // TOGGLE STATUS
  // -----------------------------
  const toggleStatus = async (u) => {
    try {
      await userService.update(u.id, {
        status: u.status === 'Active' ? 'Inactive' : 'Active',
      });

      toast.success(
        `${u.name} is now ${
          u.status === 'Active' ? 'inactive' : 'active'
        }`
      );

      refetch();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Could not update user'
      );
    }
  };

  // -----------------------------
  // DELETE USER
  // -----------------------------
  const handleDelete = async () => {
    try {
      await userService.remove(deleteTarget.id);

      toast.success('User removed');

      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Could not remove user'
      );
    }
  };

  // -----------------------------
  // TABLE COLUMNS
  // -----------------------------
  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <img
            src={r.avatar}
            alt={r.name}
            className="h-8 w-8 rounded-full object-cover"
          />

          <div>
            <p className="font-medium text-secondary-800">
              {r.name}
            </p>

            <p className="text-xs text-secondary-400">
              {r.email}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: 'role',
      header: 'Role',
      render: (r) => (
        <span className="capitalize">
          {r.role}
        </span>
      ),
    },

    {
      key: 'phone',
      header: 'Phone',
    },

    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <button onClick={() => toggleStatus(r)}>
          <Badge>{r.status}</Badge>
        </button>
      ),
    },

    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <button
          onClick={() => setDeleteTarget(r)}
          className="rounded-lg p-1.5 text-danger-500 hover:bg-danger-50"
        >
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-secondary-900">
            Users
          </h1>

          <p className="mt-1 text-sm text-secondary-500">
            Manage staff accounts and roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl bg-secondary-100 px-3 py-2 text-xs text-secondary-500 sm:flex">
            <UserCog size={14} />
            {users?.length || 0} team members
          </div>

          <button
            type="button"
            onClick={() => setShowAddUser(true)}
            className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* ADD USER FORM */}
      {showAddUser && (
        <div className="rounded-2xl border border-secondary-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-secondary-900">
                Add User
              </h2>

              <p className="mt-1 text-sm text-secondary-500">
                Create a Chef or Cashier account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddUser(false)}
              className="rounded-lg p-2 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-800"
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={handleCreateUser}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {/* NAME */}
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary-700">
                Name
              </label>

              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    name: e.target.value,
                  })
                }
                placeholder="Enter name"
                required
                className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary-700">
                Email
              </label>

              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    email: e.target.value,
                  })
                }
                placeholder="Enter email"
                required
                className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary-700">
                Phone
              </label>

              <input
                type="text"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    phone: e.target.value,
                  })
                }
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary-700">
                Password
              </label>

              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    password: e.target.value,
                  })
                }
                placeholder="Minimum 6 characters"
                minLength={6}
                required
                className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary-700">
                Role
              </label>

              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              >
                <option value="chef">Chef</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>

            {/* BUTTONS */}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddUser(false)}
                className="w-full rounded-lg border border-secondary-200 px-4 py-2.5 text-sm font-semibold text-secondary-700 hover:bg-secondary-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH + ROLE FILTER */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search users..."
          className="sm:max-w-xs"
        />

        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={ROLES}
          className="sm:max-w-[180px]"
        />
      </div>

      {/* USER TABLE */}
      <Card padded={false} className="p-4">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          pageSize={8}
        />
      </Card>

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove this user?"
        description={`${deleteTarget?.name} will lose access to ChefQueue.`}
      />

    </div>
  );
}