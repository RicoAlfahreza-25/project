import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  role: 'admin' | 'branch';
  name: string;
  branchId?: number;
  branchCode?: string;
  branchName?: string;
}

interface AuthData {
  user: User;
  token: string;
}

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      try {
        const parsedAuth: AuthData = JSON.parse(authData);
        setUser(parsedAuth.user);
        setToken(parsedAuth.token);
      } catch (error) {
        console.error('Error parsing auth data:', error);
        localStorage.removeItem('authData');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User, token: string, redirectPath: string) => {
    const authData: AuthData = { user: userData, token };
    localStorage.setItem('authData', JSON.stringify(authData));
    setUser(userData);
    setToken(token);
    navigate(redirectPath);
  };

  const logout = () => {
    localStorage.removeItem('authData');
    setUser(null);
    setToken(null);
    navigate('/');
  };

  const requireAuth = (requiredRole?: 'admin' | 'branch') => {
    if (!user) {
      navigate('/');
      return false;
    }

    if (requiredRole && user.role !== requiredRole) {
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'branch') {
        navigate('/branch-dashboard');
      }
      return false;
    }

    return true;
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
    requireAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isBranch: user?.role === 'branch'
  };
}