import mongoose from 'mongoose';
import { getNextSequence } from './Counter.js';

export const ORDER_STATUSES = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
export const PAYMENT_STATUSES = ['Paid', 'Unpaid', 'Refunded'];
export const ORDER_PRIORITIES = ['Low', 'Normal', 'High'];

// Snapshot of a menu item at the time the order was placed. Keeping name/price here
// (rather than only a ref) means deleting a menu item later never breaks historical orders.
const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: Number, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    customer: { type: String, default: 'Walk-in Guest' },
    table: { type: String, required: true },
    items: { type: [orderItemSchema], validate: (v) => Array.isArray(v) && v.length > 0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'Pending' },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'Unpaid' },
    priority: { type: String, enum: ORDER_PRIORITIES, default: 'Normal' },
    total: { type: Number, required: true, min: 0 },
    cookingTime: { type: Number, default: 10 },
    createdBy: { type: Number, ref: 'User' },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function preSave(next) {
  if (!this.isNew) return next();
  this.id = await getNextSequence('orders');
  next();
});

orderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    // The frontend's cart/order-item rendering only ever reads `.name`, `.qty`, `.price`,
    // but we surface `id` as an alias of `menuItem` on each item for forward compatibility.
    ret.items = ret.items.map((it) => ({ id: it.menuItem, ...it }));
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Order', orderSchema);
