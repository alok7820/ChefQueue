import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(); // allow anonymous connections, just no role room
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = payload.userId;
      socket.data.role = payload.role;
    } catch {
      // Ignore bad tokens rather than hard-failing the socket handshake.
    }
    next();
  });

  io.on('connection', (socket) => {
    if (socket.data.role) {
      socket.join(`role:${socket.data.role}`);
    }
    socket.join('all');

    socket.on('disconnect', () => {
      // no-op, rooms are cleaned up automatically
    });
  });

  return io;
}

export function getIO() {
  return io;
}

// Broadcasts an order-related event to every connected client (kitchen, cashier, admin
// dashboards all listen the same way). `type` is one of order:created / order:updated /
// order:statusChanged / order:completed / order:deleted.
export function emitOrderEvent(type, order) {
  if (!io) return;
  io.to('all').emit(type, order);
}
