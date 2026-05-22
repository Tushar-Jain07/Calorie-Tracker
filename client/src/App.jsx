import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import MobileNav from './components/layout/MobileNav';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FoodLog from './pages/FoodLog';
import Calculator from './pages/Calculator';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

export default function App() {
  const { loadUser, isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, []);

  // Show nothing while loading auth state
  if (loading) {
    return (
      <div className="auth-page">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>🔥</div>
          <div style={{ color: 'var(--text-secondary)' }}>Loading MacroSnap...</div>
        </div>
      </div>
    );
  }

  // Public routes (no sidebar/navbar)
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/food-log" element={<ProtectedRoute><FoodLog /></ProtectedRoute>} />
        <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}
