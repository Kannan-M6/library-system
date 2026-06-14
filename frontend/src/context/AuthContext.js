import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await authAPI.me();
        setUser(res.data.user);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [token]);

  const DEMO_USERS = [
    { email:'librarian@paavai.edu', password:'lib@2024',     role:'librarian', name:'Ms. Kavitha (Librarian)', id:100 },
    { email:'kannan@paavai.edu',    password:'student@2024', role:'student',   name:'Kannan M', id:1, rollNo:'21BAID001', department:'AI & Data Science', year:'3' },
    { email:'suresh@paavai.edu',    password:'staff@2024',   role:'teacher',   name:'Prof. Suresh M', id:102, staffId:'STAFF002', department:'Computer Science', designation:'Assistant Professor' },
  ];

  const login = useCallback(async ({ email, password }) => {
    try {
      const res = await authAPI.login({ email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      return userData;
    } catch {
      // Demo / offline fallback
      const demo = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (demo) {
        const { password: _, ...userData } = demo;
        setUser(userData);
        return userData;
      }
      throw new Error('Invalid credentials. Try demo accounts shown on the login page.');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const register = useCallback(async (formData) => {
    try {
      const res = await authAPI.register(formData);
      const { access_token, user: userData } = res.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      return userData;
    } catch (err) {
      // Fallback: create a local student session for demo/offline mode
      const mockUser = {
        id: Date.now(), name: formData.name, email: formData.email,
        role: 'student', rollNo: formData.rollNo,
        department: formData.department, year: formData.year,
      };
      setUser(mockUser);
      return mockUser;
    }
  }, []);

  const isLibrarian = user?.role === 'librarian';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, isLibrarian }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
