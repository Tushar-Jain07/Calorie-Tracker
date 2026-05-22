import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="auth-page">
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="skeleton skeleton-heading" style={{ width: '120px', margin: '0 auto 1rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '200px', margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
