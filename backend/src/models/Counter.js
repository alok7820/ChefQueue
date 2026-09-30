import mongoose from 'mongoose';

// The existing frontend was built against small numeric ids (order.id, menuItem.id, user.id)
// e.g. orderCode() does `#OQ-${String(id).padStart(4, '0')}` and orderService.getById does
// `orders.find(o => o.id === Number(id))`. Rather than redesign the UI to work with Mongo
// ObjectIds, every collection gets its own auto-incrementing numeric `id` field (in addition
// to Mongo's internal `_id`), generated here.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

export async function getNextSequence(name) {
  const result = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
}

export default Counter;
