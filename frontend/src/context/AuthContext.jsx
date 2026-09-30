import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  // `loading` covers both explicit login/register calls AND the initial session-restore
  // check below, so ProtectedRoute shows a spinner instead of flashing the login page
  // while we confirm the stored token is still valid.
  const [loading, setLoading] = useState(!!authService.getToken());

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    // Restore auth state from the stored JWT on page refresh/reload, and drop it if the
    // token is no longer valid (expired, user deactivated/deleted, etc).
    authService
      .fetchMe()
      .then((freshUser) => setUser(freshUser))
      .catch(() => {
        authService.logout();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { user } = await authService.login(email, password);
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { user } = await authService.register(payload);
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // Re-pulls the current user from the API (e.g. after a profile edit) so the rest of the
  // app — navbar, sidebar, profile page — stays in sync without a full page reload.
  const refreshUser = useCallback(async () => {
    const freshUser = await authService.fetchMe();
    setUser(freshUser);
    return freshUser;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
