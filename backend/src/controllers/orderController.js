import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { emitOrderEvent } from '../socket/socket.js';

export async function listOrders(req, res, next) {
  try {
    const { status, paymentStatus, priority, date, sort } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (paymentStatus && paymentStatus !== 'All') filter.paymentStatus = paymentStatus;
    if (priority && priority !== 'All') filter.priority = priority;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    let sortSpec = { createdAt: -1 };
    if (sort === 'priority') {
      // Custom priority ordering isn't natively sortable by string, so map to a rank field.
      sortSpec = { priorityRank: -1, createdAt: -1 };
    }

    let query = Order.find(filter);
    if (sort === 'priority') {
      const priorityOrder = { High: 3, Normal: 2, Low: 1 };
      const orders = await query.sort({ createdAt: -1 });
      orders.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
      return res.json({ success: true, data: orders });
    }

    const orders = await query.sort(sortSpec);
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) throw new ApiError(404, 'Order not found');
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function createOrder(req, res, next) {
  try {
    const { customer, table, items, priority } = req.body;

    // Never trust prices/totals sent from the client — look every item up server-side.
    const menuIds = items.map((it) => it.id ?? it.menuItem);
    const menuItems = await MenuItem.find({ id: { $in: menuIds } });
    const menuById = new Map(menuItems.map((m) => [m.id, m]));

    let total = 0;
    let maxPrepTime = 10;
    const resolvedItems = items.map((it) => {
      const menuItem = menuById.get(Number(it.id ?? it.menuItem));
      if (!menuItem) throw new ApiError(400, `Menu item ${it.id ?? it.menuItem} does not exist`);
      if (!menuItem.available) throw new ApiError(400, `"${menuItem.name}" is currently unavailable`);
      const qty = Math.max(1, Number(it.qty) || 1);
      total += menuItem.price * qty;
      maxPrepTime = Math.max(maxPrepTime, menuItem.prepTime);
      return { menuItem: menuItem.id, name: menuItem.name, qty, price: menuItem.price };
    });

    const order = await Order.create({
      customer: customer || 'Walk-in Guest',
      table,
      items: resolvedItems,
      priority: priority || 'Normal',
      total,
      cookingTime: req.body.cookingTime || maxPrepTime,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      createdBy: req.user.id,
    });

    emitOrderEvent('order:created', order);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function updateOrder(req, res, next) {
  try {
    const allowed = ['customer', 'table', 'priority', 'paymentStatus'];
    const patch = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }

    const order = await Order.findOneAndUpdate({ id: req.params.id }, patch, {
      new: true,
      runValidators: true,
    });
    if (!order) throw new ApiError(404, 'Order not found');

    emitOrderEvent('order:updated', order);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

const STATUS_PERMISSIONS = {
  admin: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
  chef: ['Pending', 'Preparing', 'Ready', 'Completed'],
  cashier: ['Cancelled'],
};

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowedStatuses = STATUS_PERMISSIONS[req.user.role] || [];
    if (!allowedStatuses.includes(status)) {
      throw new ApiError(403, `Your role cannot set order status to "${status}"`);
    }

    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true, runValidators: true }
    );
    if (!order) throw new ApiError(404, 'Order not found');

    emitOrderEvent('order:statusChanged', order);
    if (status === 'Completed') emitOrderEvent('order:completed', order);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function deleteOrder(req, res, next) {
  try {
    const order = await Order.findOneAndDelete({ id: req.params.id });
    if (!order) throw new ApiError(404, 'Order not found');
    emitOrderEvent('order:deleted', { id: order.id });
    res.json({ success: true, data: { id: order.id } });
  } catch (err) {
    next(err);
  }
}
