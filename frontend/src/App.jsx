import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import MenuManagement from './pages/admin/MenuManagement';
import OrderManagement from './pages/admin/OrderManagement';
import Analytics from './pages/admin/Analytics';
import UserManagement from './pages/admin/UserManagement';

import ChefDashboard from './pages/chef/ChefDashboard';
import KitchenQueue from './pages/chef/KitchenQueue';
import CompletedOrders from './pages/chef/CompletedOrders';

import CashierDashboard from './pages/cashier/CashierDashboard';
import NewOrder from './pages/cashier/NewOrder';
import CashierOrders from './pages/cashier/CashierOrders';
import Payments from './pages/cashier/Payments';

import Profile from './pages/shared/Profile';
import Settings from './pages/shared/Settings';
import AIAssistant from './pages/shared/AIAssistant';
import Unauthorized from './pages/shared/Unauthorized';
import NotFound from './pages/shared/NotFound';

function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}/dashboard`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SocketProvider>
          <BrowserRouter>
            <Toaster position="top-right" toastOptions={{
              style: { fontSize: '14px', borderRadius: '10px' },
              success: { iconTheme: { primary: '#F97316', secondary: 'white' } },
            }} />
            <Routes>
              <Route path="/" element={<RootRedirect />} />

              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                {/* <Route path="/register" element={<Register />} /> */}
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/menu" element={<MenuManagement />} />
                  <Route path="/admin/orders" element={<OrderManagement />} />
                  <Route path="/admin/analytics" element={<Analytics />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/ai-assistant" element={<AIAssistant />} />
                  <Route path="/admin/settings" element={<Settings />} />
                  <Route path="/admin/profile" element={<Profile />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['chef']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/chef/dashboard" element={<ChefDashboard />} />
                  <Route path="/chef/queue" element={<KitchenQueue />} />
                  <Route path="/chef/completed" element={<CompletedOrders />} />
                  <Route path="/chef/ai-assistant" element={<AIAssistant />} />
                  <Route path="/chef/profile" element={<Profile />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['cashier']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/cashier/dashboard" element={<CashierDashboard />} />
                  <Route path="/cashier/new-order" element={<NewOrder />} />
                  <Route path="/cashier/orders" element={<CashierOrders />} />
                  <Route path="/cashier/ai-assistant" element={<AIAssistant />} />
                  <Route path="/cashier/payments" element={<Payments />} />
                  <Route path="/cashier/profile" element={<Profile />} />
                </Route>
              </Route>

              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
