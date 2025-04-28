import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setToken(response.data.token);
      console.log('Auth state updated:', { user: response.data.user, token: response.data.token });
      localStorage.setItem('auth_debug', JSON.stringify({ user: response.data.user, token: response.data.token }));
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        name,
        email,
        password
      });
      
      // On successful registration, set the user state and token
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return; // Success case
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    console.log('Auth state updated:', { user: null, token: null });
    localStorage.setItem('auth_debug', JSON.stringify({ user: null, token: null }));
  };

  if (loading) return <div>Loading...</div>;

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};