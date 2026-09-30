import mongoose from 'mongoose';
import { getNextSequence } from './Counter.js';

export const MENU_CATEGORIES = ['Starters', 'Main Course', 'Beverages', 'Desserts', 'Breads'];

const menuItemSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: MENU_CATEGORIES, required: true },
    price: { type: Number, required: true, min: 0 },
    prepTime: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

menuItemSchema.pre('save', async function preSave(next) {
  if (!this.isNew) return next();
  this.id = await getNextSequence('menuItems');
  next();
});

menuItemSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('MenuItem', menuItemSchema);
