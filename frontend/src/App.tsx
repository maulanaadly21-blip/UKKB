import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import Login from './pages/auth/Login';
import RegisterMember from './pages/auth/RegisterMember';
import RegisterAdminSpace from './pages/auth/RegisterAdminSpace';

import CatalogPage from './pages/member/CatalogPage';
import SpacesPage from './pages/member/SpacesPage';
import SpaceDetailPage from './pages/member/SpaceDetailPage';
import PromoPage from './pages/member/PromoPage';
import AboutPage from './pages/member/AboutPage';
import CheckoutPage from './pages/member/CheckoutPage';
import ReservationStatusPage from './pages/member/ReservationStatusPage';
import HistoryPage from './pages/member/HistoryPage';
import ProfilePage from './pages/member/ProfilePage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageSpacesPage from './pages/admin/ManageSpacesPage';
import ManageMembersPage from './pages/admin/ManageMembersPage';
import ManageDiscountsPage from './pages/admin/ManageDiscountsPage';
import ManageReservationsPage from './pages/admin/ManageReservationsPage';
import SpaceProfilePage from './pages/admin/SpaceProfilePage';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: string[];
}

// Protected Route Wrapper
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Memuat aplikasi SmartSpace...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<CatalogPage />} />
      <Route path="/ruang" element={<SpacesPage />} />
      <Route path="/ruang/:id" element={<SpaceDetailPage />} />
      <Route path="/space/:id" element={<SpaceDetailPage />} />
      <Route path="/promo" element={<PromoPage />} />
      <Route path="/tentang" element={<AboutPage />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register/member" element={<RegisterMember />} />
      <Route path="/register/admin-space" element={<RegisterAdminSpace />} />

      {/* Member Routes */}
      <Route
        path="/checkout/:spaceId"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <ReservationStatusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['member', 'admin_space']}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Space Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin_space']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/spaces"
        element={
          <ProtectedRoute allowedRoles={['admin_space']}>
            <ManageSpacesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members"
        element={
          <ProtectedRoute allowedRoles={['admin_space']}>
            <ManageMembersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/discounts"
        element={
          <ProtectedRoute allowedRoles={['admin_space']}>
            <ManageDiscountsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reservations"
        element={
          <ProtectedRoute allowedRoles={['admin_space']}>
            <ManageReservationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['admin_space']}>
            <SpaceProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
