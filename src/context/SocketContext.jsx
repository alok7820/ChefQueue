import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';

// Wraps socket.io-client. In this offline/demo build there is no live server,
// so the connection is simulated — swap SOCKET_URL + enable the io() call
// once a real backend is available and every consumer keeps working as-is.
const SocketContext = createContext(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setConnected(false);
      return;
    }
    // Simulated connection for the demo build (no real server to hit).
    const t = setTimeout(() => setConnected(true), 500);
    return () => clearTimeout(t);
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
}
