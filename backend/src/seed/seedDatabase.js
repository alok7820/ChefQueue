import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import Counter from '../models/Counter.js';

// Menu catalog copied from the existing frontend's src/data/mockData.js so the seeded
// database matches what the UI was originally designed and demoed against.
const MENU_ITEMS = [
  { name: 'Paneer Tikka', category: 'Starters', price: 220, prepTime: 15, available: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400' },
  { name: 'Chicken Seekh Kebab', category: 'Starters', price: 260, prepTime: 18, available: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
  { name: 'Butter Chicken', category: 'Main Course', price: 340, prepTime: 22, available: true, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
  { name: 'Dal Makhani', category: 'Main Course', price: 210, prepTime: 20, available: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
  { name: 'Veg Biryani', category: 'Main Course', price: 250, prepTime: 25, available: true, image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400' },
  { name: 'Masala Dosa', category: 'Main Course', price: 180, prepTime: 12, available: false, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400' },
  { name: 'Butter Naan', category: 'Breads', price: 60, prepTime: 8, available: true, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400' },
  { name: 'Garlic Roti', category: 'Breads', price: 55, prepTime: 8, available: true, image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400' },
  { name: 'Gulab Jamun', category: 'Desserts', price: 120, prepTime: 5, available: true, image: 'https://images.unsplash.com/photo-1601303516361-8f886554063f?w=400' },
  { name: 'Rasmalai', category: 'Desserts', price: 140, prepTime: 5, available: true, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400' },
  { name: 'Masala Chai', category: 'Beverages', price: 50, prepTime: 6, available: true, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400' },
  { name: 'Fresh Lime Soda', category: 'Beverages', price: 70, prepTime: 4, available: true, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400' },
];

const USERS = [
  { name: 'Admin Owner', email: 'admin@chefqueue.app', password: 'admin123', role: 'admin', phone: '+91 90000 00001', status: 'Active' },
  { name: 'Rahul Chef', email: 'chef@chefqueue.app', password: 'chef123', role: 'chef', phone: '+91 98765 43210', status: 'Active' },
  { name: 'Neha Cashier', email: 'cashier@chefqueue.app', password: 'cashier123', role: 'cashier', phone: '+91 91234 56780', status: 'Active' },
  { name: 'Sanjay Kitchen', email: 'sanjay@chefqueue.app', password: 'chef123', role: 'chef', phone: '+91 99887 76655', status: 'Inactive' },
];

const STATUSES = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
const PAYMENT_STATUSES = ['Paid', 'Unpaid', 'Refunded'];
const PRIORITIES = ['Low', 'Normal', 'High'];
const CUSTOMERS = ['Aarav Sharma', 'Priya Singh', 'Rohan Mehta', 'Isha Kapoor', 'Karan Verma', 'Walk-in Guest', 'Ananya Rao', 'Vivaan Joshi'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function minutesAgo(n) {
  return new Date(Date.now() - n * 60000);
}

async function seed() {
  await connectDB();

  console.log('[seed] clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    MenuItem.deleteMany({}),
    Order.deleteMany({}),
    Counter.deleteMany({}),
  ]);

  console.log('[seed] creating users...');
  const users = [];
  for (const u of USERS) {
    users.push(await User.create(u));
  }

  console.log('[seed] creating menu items...');
  const menuItems = [];
  for (const item of MENU_ITEMS) {
    menuItems.push(await MenuItem.create(item));
  }

  console.log('[seed] creating sample orders...');
  const cashier = users.find((u) => u.role === 'cashier');
  for (let i = 0; i < 42; i += 1) {
    const itemCount = 1 + Math.floor(Math.random() * 3);
    const chosen = Array.from({ length: itemCount }).map(() => randomFrom(menuItems));
    const items = chosen.map((item) => {
      const qty = 1 + Math.floor(Math.random() * 3);
      return { menuItem: item.id, name: item.name, qty, price: item.price };
    });
    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const createdAt = minutesAgo(Math.floor(Math.random() * 600));

    const order = new Order({
      customer: randomFrom(CUSTOMERS),
      table: `T-${1 + Math.floor(Math.random() * 18)}`,
      items,
      status: randomFrom(STATUSES),
      paymentStatus: randomFrom(PAYMENT_STATUSES),
      priority: randomFrom(PRIORITIES),
      total,
      cookingTime: 10 + Math.floor(Math.random() * 20),
      createdBy: cashier?.id,
    });
    order.createdAt = createdAt;
    order.updatedAt = createdAt;
    await order.save();
  }

  console.log('[seed] done!');
  console.log('[seed] demo accounts:');
  for (const u of USERS) {
    console.log(`  ${u.role.padEnd(8)} ${u.email}  /  ${u.password}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
