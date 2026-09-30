import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const ORDER_EVENTS = ['order:created', 'order:updated', 'order:statusChanged', 'order:completed', 'order:deleted'];

// Subscribes to every order-related Socket.IO event and calls `refetch` whenever one fires,
// so kitchen/cashier/admin screens stay in sync with what other users are doing in real time.
export function useOrderSocket(refetch) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return undefined;
    const handler = () => refetch();
    ORDER_EVENTS.forEach((evt) => socket.on(evt, handler));
    return () => {
      ORDER_EVENTS.forEach((evt) => socket.off(evt, handler));
    };
  }, [socket, refetch]);
}
