// frontend/src/utils/storage.ts

// -----------------------------
// Storage Keys
// -----------------------------
const STORAGE_KEYS = {
  TOKEN: "accessToken",
  USER: "user",
};

// -----------------------------
// Safe JSON Parser
// -----------------------------
function safeJSONParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn("Failed to parse JSON from storage:", error);
    return null;
  }
}

// -----------------------------
// Storage Utility
// -----------------------------
export const storage = {
  // -----------------------------
  // TOKEN METHODS
  // -----------------------------
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  clearToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // -----------------------------
  // USER METHODS
  // -----------------------------
  getUser: <T = any>(): T | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return safeJSONParse<T>(user);
  },

  setUser: (user: any): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // -----------------------------
  // CLEAR EVERYTHING
  // -----------------------------
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};
