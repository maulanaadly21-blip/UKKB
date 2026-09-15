import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { setAppKey, getAppKey } from '../api/axios';
import { User } from '../types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  appKey: string | null;
  updateAppKey: (newKey: string) => void;
  loading: boolean;
  isAuthenticated: boolean;
  isMember: boolean;
  isAdminSpace: boolean;
  login: (username: string | Record<string, any>, password?: string) => Promise<any>;
  registerMember: (formData: any) => Promise<any>;
  registerAdminSpace: (formData: any) => Promise<any>;
  registerAppMaker: (payload: any) => Promise<any>;
  loginAppMaker: (payload: any) => Promise<any>;
  updateProfile: (dataPayload: any) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token') || null);
  const [appKey, setAppKeyState] = useState<string | null>(() => getAppKey());
  const [loading, setLoading] = useState<boolean>(true);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          if (res.data && (res.data.status || res.data.statusCode === 200)) {
            const userData = res.data.data.user || res.data.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (err: any) {
          console.error('Failed to fetch user profile:', err);
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const updateAppKey = (newKey: string) => {
    setAppKey(newKey);
    setAppKeyState(newKey);
  };

  const login = async (username: string | Record<string, any>, password?: string) => {
    try {
      const payload = typeof username === 'object' ? username : { username, password };
      const res = await api.post('/auth/login', payload);
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        const responseData = res.data.data;
        const newToken = responseData.token || responseData.access_token;
        const userObj = responseData.user || responseData;
        
        setToken(newToken);
        setUser(userObj);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userObj));
        return { ...res.data, user: userObj };
      }
      throw new Error(res.data?.message || 'Login gagal');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login gagal';
      throw new Error(msg);
    }
  };

  const registerMember = async (formData: any) => {
    try {
      const res = await api.post('/auth/register/member', formData);
      if (res.data && (res.data.status || res.data.statusCode === 201)) {
        const responseData = res.data.data;
        const newToken = responseData.token || responseData.access_token;
        const userObj = responseData.user || responseData;
        if (newToken) {
          setToken(newToken);
          setUser(userObj);
          localStorage.setItem('token', newToken);
          localStorage.setItem('user', JSON.stringify(userObj));
        }
        return { ...res.data, user: userObj };
      }
      throw new Error(res.data?.message || 'Registrasi member gagal');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registrasi member gagal';
      throw new Error(msg);
    }
  };

  const registerAdminSpace = async (formData: any) => {
    try {
      const res = await api.post('/auth/register/admin-space', formData);
      if (res.data && (res.data.status || res.data.statusCode === 201)) {
        const responseData = res.data.data;
        const newToken = responseData.token || responseData.access_token;
        const userObj = responseData.user || responseData;
        if (newToken) {
          setToken(newToken);
          setUser(userObj);
          localStorage.setItem('token', newToken);
          localStorage.setItem('user', JSON.stringify(userObj));
        }
        return { ...res.data, user: userObj };
      }
      throw new Error(res.data?.message || 'Registrasi admin space gagal');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registrasi admin space gagal';
      throw new Error(msg);
    }
  };

  const registerAppMaker = async (payload: any) => {
    try {
      const res = await api.post('/maker/register', payload);
      if (res.data && (res.data.status || res.data.statusCode === 201)) {
        const { app_key } = res.data.data;
        if (app_key) {
          updateAppKey(app_key);
        }
        return res.data;
      }
      throw new Error(res.data?.message || 'Registrasi App Maker gagal');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registrasi App Maker gagal';
      throw new Error(msg);
    }
  };

  const loginAppMaker = async (payload: any) => {
    try {
      const res = await api.post('/maker/login', payload);
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        const { app_key } = res.data.data;
        if (app_key) {
          updateAppKey(app_key);
        }
        return res.data;
      }
      throw new Error(res.data?.message || 'Login App Maker gagal');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login App Maker gagal';
      throw new Error(msg);
    }
  };

  const updateProfile = async (dataPayload: any) => {
    try {
      const isFormData = dataPayload instanceof FormData;
      const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      const endpoint = user?.role === 'admin_space' ? '/admin/profile' : '/auth/profile';
      const res = await api.put(endpoint, dataPayload, config);
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        return res.data;
      }
      throw new Error(res.data?.message || 'Gagal mengupdate profil');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal mengupdate profil';
      throw new Error(msg);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    appKey,
    updateAppKey,
    loading,
    isAuthenticated: !!token && !!user,
    isMember: user?.role === 'member',
    isAdminSpace: user?.role === 'admin_space',
    login,
    registerMember,
    registerAdminSpace,
    registerAppMaker,
    loginAppMaker,
    updateProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
