import { create } from 'zustand';
import { authAPI } from '../api/auth.js';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Инициализация (проверка токена при загрузке)
  init: async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      set({ isLoading: true });
      const data = await authAPI.getMe();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Логин
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await authAPI.login({ email, password });
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },

  // Регистрация
  register: async (email, password, name) => {
    set({ isLoading: true });
    try {
      const data = await authAPI.register({ email, password, name });
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
        details: error.response?.data?.details,
      };
    }
  },

  // Выход
  logout: async () => {
    await authAPI.logout();
    set({ user: null, isAuthenticated: false });
  },
}));

