import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      if (Date.now() > expirationTime) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
      return true;
    }
  }, [router]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (checkTokenExpiration()) {
          setLoading(false);
          return;
        }
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, [checkTokenExpiration]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/signin', credentials);
      const userData = response.role;
      const tokenData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', tokenData);
      console.log('userData::', response);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkTokenExpiration,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
