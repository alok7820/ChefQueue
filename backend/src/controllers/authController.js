import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../middleware/errorMiddleware.js';

function signToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
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

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }
    if (user.status !== 'Active') {
      throw new ApiError(403, 'This account has been deactivated. Contact an administrator.');
    }

    const token = signToken(user);
    res.json({ success: true, data: { token, user: publicUser(user) } });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;
    // Security: never let self-registration grant admin — only an existing admin can
    // promote someone via the user-management API.
    const role = ['chef', 'cashier'].includes(req.body.role) ? req.body.role : 'cashier';

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw new ApiError(409, 'An account with that email already exists');

    const user = await User.create({ name, email: email.toLowerCase(), password, phone, role });
    const token = signToken(user);
    res.status(201).json({ success: true, data: { token, user: publicUser(user) } });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res) {
  res.json({ success: true, data: publicUser(req.user) });
}
