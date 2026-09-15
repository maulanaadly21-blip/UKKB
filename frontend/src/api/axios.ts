import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAppKey = (): string => {
  return localStorage.getItem('app_key') || import.meta.env.VITE_APP_KEY || 'mk_default_ukk_2026';
};

export const setAppKey = (key?: string | null): void => {
  if (key) {
    localStorage.setItem('app_key', key);
  } else {
    localStorage.removeItem('app_key');
  }
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const appKey = getAppKey();
    if (appKey) {
      config.headers['x-maker-key'] = appKey;
      config.headers['x-app-key'] = appKey;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      if (error.response.data && error.response.data.message) {
        error.message = error.response.data.message;
      }
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response) {
      error.message = `Gagal terhubung ke server (Network Error). Pastikan server API backend sudah berjalan di ${API_BASE_URL}.`;
    }
    return Promise.reject(error);
  }
);

export default api;
