// Web storage implementation using localStorage
const storage = {
  getItemAsync: async (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  },
  setItemAsync: async (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  },
  deleteItemAsync: async (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error deleting from localStorage:', e);
    }
  },
};

export default storage;
