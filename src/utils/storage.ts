export const storage = {
  getToken: () => localStorage.getItem('accessToken'),

  setToken: (token: string) => {
    localStorage.setItem('accessToken', token);
  },

  clearToken: () => {
    localStorage.removeItem('accessToken');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearUser: () => {
    localStorage.removeItem('user');
  },

  clearAll: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};
