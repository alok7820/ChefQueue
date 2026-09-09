import { useState, useMemo } from 'react';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { MENU_ITEMS, CATEGORIES } from '../../data/mockData';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/format';

export default function NewOrder() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState('');
  const [table, setTable] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const filtered = MENU_ITEMS.filter((it) =>
    it.available &&
    (category === 'All' || it.category === category) &&
    it.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c)).filter((c) => c.qty > 0));
  };

  const removeItem = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const total = useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);

  const submit = async () => {
    if (!cart.length) return toast.error('Add at least one item to the order');
    if (!table) return toast.error('Enter a table number');
    setSubmitting(true);
    try {
      await orderService.create({
        customer: customer || 'Walk-in Guest',
        table,
        items: cart.map((c) => ({ id: c.id, name: c.name, qty: c.qty, price: c.price })),
        priority: 'Normal',
        cookingTime: Math.max(...cart.map((c) => c.prepTime), 10),
      });
      toast.success('Order placed successfully');
      navigate('/cashier/orders');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2 space-y-4">
        <div>
          <h1 className="font-display text-xl font-bold text-secondary-900">New Order</h1>
          <p className="mt-1 text-sm text-secondary-500">Pick items from the menu to build the order.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchBar value={search} onChange={setSearch} placeholder="Search menu..." className="sm:max-w-xs" />
          <Select value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORIES} className="sm:max-w-[180px]" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((item) => (
            <button key={item.id} onClick={() => addToCart(item)} className="text-left">
              <Card padded={false} hover className="overflow-hidden">
                <div className="h-24 w-full overflow-hidden bg-secondary-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-secondary-800">{item.name}</p>
                  <p className="mt-0.5 text-sm font-semibold text-primary-600">{formatCurrency(item.price)}</p>
                </div>
              </Card>
            </button>
          ))}
        </div>
        {filtered.length === 0 && <EmptyState title="No dishes match" description="Try a different search or category." />}
      </div>

      <div>
        <Card className="sticky top-20">
          <p className="mb-4 flex items-center gap-2 font-display font-semibold text-secondary-900">
            <ShoppingCart size={16} className="text-primary-500" /> Order summary
          </p>

          <div className="space-y-3">
            <Input label="Customer name" placeholder="Walk-in Guest" value={customer} onChange={(e) => setCustomer(e.target.value)} />
            <Input label="Table number" placeholder="e.g. T-6" value={table} onChange={(e) => setTable(e.target.value)} />
          </div>

          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto border-t border-secondary-100 pt-4">
            {cart.length === 0 ? (
              <p className="py-6 text-center text-sm text-secondary-400">No items added yet</p>
            ) : cart.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-secondary-800">{c.name}</p>
                  <p className="text-xs text-secondary-400">{formatCurrency(c.price)} each</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => updateQty(c.id, -1)} className="rounded-md border border-secondary-200 p-1 hover:bg-secondary-50"><Minus size={12} /></button>
                  <span className="w-5 text-center text-sm font-medium">{c.qty}</span>
                  <button onClick={() => updateQty(c.id, 1)} className="rounded-md border border-secondary-200 p-1 hover:bg-secondary-50"><Plus size={12} /></button>
                  <button onClick={() => removeItem(c.id)} className="ml-1 rounded-md p-1 text-danger-500 hover:bg-danger-50"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-secondary-100 pt-4">
            <span className="text-sm font-medium text-secondary-500">Total</span>
            <span className="font-display text-lg font-bold text-secondary-900">{formatCurrency(total)}</span>
          </div>

          <Button className="mt-4 w-full" size="lg" onClick={submit} loading={submitting}>Place Order</Button>
        </Card>
      </div>
    </div>
  );
}
