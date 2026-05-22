import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export function useAuth(requireAuth = true) {
  const { isAuthenticated, loading, user, loadUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, requireAuth, navigate]);

  return { isAuthenticated, loading, user };
}

export function useRedirectIfAuth() {
  const { isAuthenticated, loading, loadUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [loading, isAuthenticated, navigate]);

  return { isAuthenticated, loading };
}
