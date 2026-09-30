import User from '../models/User.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export async function listUsers(req, res, next) {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role && role !== 'All') filter.role = role;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const users = await User.find(filter).sort({ id: 1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const allowed = ['name', 'email', 'phone', 'role', 'status', 'avatar'];
    const patch = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }
    if (patch.email) patch.email = patch.email.toLowerCase();

    const user = await User.findOneAndUpdate({ id: req.params.id }, patch, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, data: { id: user.id } });
  } catch (err) {
    next(err);
  }
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    status: user.status,
    avatar: user.avatar,
  };
}
export async function createUser(req, res, next) {
  try {
    const { name, email, password, role, phone } = req.body;

    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      throw new ApiError(
        409,
        'An account with that email already exists'
      );
    }

    // Admin can create only staff accounts.
    if (!['chef', 'cashier'].includes(role)) {
      throw new ApiError(
        400,
        'Only Chef or Cashier accounts can be created here'
      );
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      phone: phone || '',
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}
export async function getMyProfile(req, res) {
  res.json({ success: true, data: publicUser(req.user) });
}

export async function updateMyProfile(req, res, next) {
  try {
    const allowed = ['name', 'phone', 'avatar'];
    const patch = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }
    const user = await User.findOneAndUpdate({ id: req.user.id }, patch, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function changeMyPassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ id: req.user.id }).select('+password');
    const matches = await user.comparePassword(currentPassword);
    if (!matches) throw new ApiError(401, 'Current password is incorrect');
    user.password = newPassword; // pre-save hook hashes it
    await user.save();
    res.json({ success: true, data: { message: 'Password updated' } });
  } catch (err) {
    next(err);
  }
}
