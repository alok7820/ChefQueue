import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useFetch } from '../../hooks/useFetch';
import { useDebounce } from '../../hooks/useDebounce';
import { menuService } from '../../services/menuService';
import { CATEGORIES } from '../../data/mockData';
import { formatCurrency } from '../../utils/format';

export default function MenuManagement() {
  const { data: items, loading, refetch } = useFetch(() => menuService.getAll(), []);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [category, setCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((it) =>
      (category === 'All' || it.category === category) &&
      it.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [items, category, debouncedSearch]);

  const openAdd = () => { setEditing({ name: '', category: 'Starters', price: '', prepTime: '', available: true, image: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing.id) {
        await menuService.update(editing.id, editing);
        toast.success('Item updated');
      } else {
        await menuService.create({ ...editing, price: Number(editing.price), prepTime: Number(editing.prepTime) });
        toast.success('Item added to menu');
      }
      setModalOpen(false);
      refetch();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await menuService.remove(deleteTarget.id);
    toast.success('Item removed');
    setDeleteTarget(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-bold text-secondary-900">Menu Management</h1>
          <p className="mt-1 text-sm text-secondary-500">{items?.length || 0} items across {CATEGORIES.length - 1} categories.</p>
        </div>
        <Button icon={Plus} onClick={openAdd}>Add Item</Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search menu items..." className="sm:max-w-xs" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORIES} className="sm:max-w-[180px]" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} title="No dishes found" description="Try a different search term or category." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <Card key={item.id} padded={false} hover className="overflow-hidden">
              <div className="relative h-32 w-full overflow-hidden bg-secondary-100">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                {!item.available && (
                  <span className="absolute left-2 top-2 rounded-full bg-secondary-900/80 px-2 py-0.5 text-[11px] font-medium text-white">Unavailable</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-secondary-900">{item.name}</p>
                    <p className="text-xs text-secondary-400">{item.category} · {item.prepTime} min</p>
                  </div>
                  <p className="font-display text-sm font-bold text-primary-600">{formatCurrency(item.price)}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-secondary-200 py-1.5 text-xs font-medium text-secondary-600 hover:bg-secondary-50">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-danger-200 py-1.5 text-xs font-medium text-danger-600 hover:bg-danger-50">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing?.id ? 'Edit item' : 'Add new item'}
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>Save item</Button></>}>
        {editing && (
          <div className="space-y-4">
            <Input label="Item name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Category" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} options={CATEGORIES.filter((c) => c !== 'All')} />
              <Input label="Price (₹)" type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
            </div>
            <Input label="Preparation time (min)" type="number" value={editing.prepTime} onChange={(e) => setEditing({ ...editing, prepTime: e.target.value })} />
            <Input label="Image URL" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
            <label className="flex items-center gap-2 text-sm text-secondary-700">
              <input type="checkbox" checked={editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })} className="h-4 w-4 rounded accent-primary-500" />
              Available on menu
            </label>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete menu item?"
        description={`"${deleteTarget?.name}" will be removed from the menu permanently.`}
      />
    </div>
  );
}
