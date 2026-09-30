// ---- Mock dataset powering the entire UI (no backend required) ----

export const CATEGORIES = ['All', 'Starters', 'Main Course', 'Beverages', 'Desserts', 'Breads'];

export const MENU_ITEMS = [
  { id: 1, name: 'Paneer Tikka', category: 'Starters', price: 220, prepTime: 15, available: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400' },
  { id: 2, name: 'Chicken Seekh Kebab', category: 'Starters', price: 260, prepTime: 18, available: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
  { id: 3, name: 'Butter Chicken', category: 'Main Course', price: 340, prepTime: 22, available: true, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
  { id: 4, name: 'Dal Makhani', category: 'Main Course', price: 210, prepTime: 20, available: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
  { id: 5, name: 'Veg Biryani', category: 'Main Course', price: 250, prepTime: 25, available: true, image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400' },
  { id: 6, name: 'Masala Dosa', category: 'Main Course', price: 180, prepTime: 12, available: false, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400' },
  { id: 7, name: 'Butter Naan', category: 'Breads', price: 60, prepTime: 8, available: true, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400' },
  { id: 8, name: 'Garlic Roti', category: 'Breads', price: 55, prepTime: 8, available: true, image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400' },
  { id: 9, name: 'Gulab Jamun', category: 'Desserts', price: 120, prepTime: 5, available: true, image: 'https://images.unsplash.com/photo-1601303516361-8f886554063f?w=400' },
  { id: 10, name: 'Rasmalai', category: 'Desserts', price: 140, prepTime: 5, available: true, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400' },
  { id: 11, name: 'Masala Chai', category: 'Beverages', price: 50, prepTime: 6, available: true, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400' },
  { id: 12, name: 'Fresh Lime Soda', category: 'Beverages', price: 70, prepTime: 4, available: true, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400' },
];

const STATUSES = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
const PAYMENT_STATUSES = ['Paid', 'Unpaid', 'Refunded'];
const PRIORITIES = ['Low', 'Normal', 'High'];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function minutesAgo(n) { return new Date(Date.now() - n * 60000).toISOString(); }

export const ORDERS = Array.from({ length: 42 }).map((_, i) => {
  const items = Array.from({ length: 1 + Math.floor(Math.random() * 3) }).map(() => {
    const item = randomFrom(MENU_ITEMS);
    return { id: item.id, name: item.name, qty: 1 + Math.floor(Math.random() * 3), price: item.price };
  });
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  return {
    id: i + 1,
    customer: randomFrom(['Aarav Sharma', 'Priya Singh', 'Rohan Mehta', 'Isha Kapoor', 'Karan Verma', 'Walk-in Guest', 'Ananya Rao', 'Vivaan Joshi']),
    table: `T-${1 + Math.floor(Math.random() * 18)}`,
    items,
    status: randomFrom(STATUSES),
    paymentStatus: randomFrom(PAYMENT_STATUSES),
    priority: randomFrom(PRIORITIES),
    total,
    createdAt: minutesAgo(Math.floor(Math.random() * 600)),
    cookingTime: 10 + Math.floor(Math.random() * 20),
  };
});

export const REVENUE_TREND = [
  { day: 'Mon', revenue: 18400, orders: 62 },
  { day: 'Tue', revenue: 21200, orders: 71 },
  { day: 'Wed', revenue: 19800, orders: 65 },
  { day: 'Thu', revenue: 24600, orders: 84 },
  { day: 'Fri', revenue: 31200, orders: 103 },
  { day: 'Sat', revenue: 38900, orders: 128 },
  { day: 'Sun', revenue: 33500, orders: 112 },
];

export const STATUS_DISTRIBUTION = [
  { name: 'Completed', value: 58, color: '#22c55e' },
  { name: 'Preparing', value: 18, color: '#F97316' },
  { name: 'Pending', value: 12, color: '#f59e0b' },
  { name: 'Ready', value: 9, color: '#3b82f6' },
  { name: 'Cancelled', value: 3, color: '#ef4444' },
];

export const TOP_ITEMS = [
  { name: 'Butter Chicken', sold: 312, revenue: 106080 },
  { name: 'Veg Biryani', sold: 274, revenue: 68500 },
  { name: 'Paneer Tikka', sold: 251, revenue: 55220 },
  { name: 'Masala Chai', sold: 240, revenue: 12000 },
  { name: 'Butter Naan', sold: 410, revenue: 24600 },
];

export const USERS = [
  { id: 1, name: 'Rahul Chef', email: 'rahul@chefqueue.app', role: 'chef', phone: '+91 98765 43210', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=rahul' },
  { id: 2, name: 'Neha Cashier', email: 'neha@chefqueue.app', role: 'cashier', phone: '+91 91234 56780', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=neha' },
  { id: 3, name: 'Admin Owner', email: 'admin@chefqueue.app', role: 'admin', phone: '+91 90000 00001', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=admin' },
  { id: 4, name: 'Sanjay Kitchen', email: 'sanjay@chefqueue.app', role: 'chef', phone: '+91 99887 76655', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=sanjay' },
];

export const AI_SUGGESTED_PROMPTS = [
  "What's today's kitchen summary?",
  'Which orders should be prioritized right now?',
  'Estimate prep time for Table T-6',
  "What's the current kitchen workload?",
];
