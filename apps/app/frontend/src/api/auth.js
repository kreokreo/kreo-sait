import apiClient from './client.js';

export const authAPI = {
  // Регистрация
  register: async (data) => {
    const response = await apiClient.post('/api/auth/register', data);
    if (response.data.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    }
    return response.data;
  },

  // Логин
  login: async (data) => {
    const response = await apiClient.post('/api/auth/login', data);
    if (response.data.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    }
    return response.data;
  },

  // Выход
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await apiClient.post('/api/auth/logout', { refreshToken });
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Получение текущего пользователя
  getMe: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};

