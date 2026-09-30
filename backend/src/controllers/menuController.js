import MenuItem from '../models/MenuItem.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export async function updateMenuAvailability(req, res, next) {
  try {
    const { available } = req.body;

    const item = await MenuItem.findOneAndUpdate(
      { id: req.params.id },
      { available },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) throw new ApiError(404, 'Menu item not found');

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
export async function listMenuItems(req, res, next) {
  try {
    const { search, category, available, page, limit } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category && category !== 'All') filter.category = category;
    if (available !== undefined) filter.available = available === 'true';

    if (page || limit) {
      const pageNum = Math.max(1, Number(page) || 1);
      const limitNum = Math.max(1, Number(limit) || 20);
      const [items, total] = await Promise.all([
        MenuItem.find(filter).sort({ id: 1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
        MenuItem.countDocuments(filter),
      ]);
      return res.json({
        success: true,
        data: items,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
      });
    }

    const items = await MenuItem.find(filter).sort({ id: 1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function getMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findOne({ id: req.params.id });
    if (!item) throw new ApiError(404, 'Menu item not found');
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function createMenuItem(req, res, next) {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Menu item not found');
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findOneAndDelete({ id: req.params.id });
    if (!item) throw new ApiError(404, 'Menu item not found');
    // Historical orders keep a snapshot of name/price, so removing the menu item
    // itself never breaks past order records.
    res.json({ success: true, data: { id: item.id } });
  } catch (err) {
    next(err);
  }
}
