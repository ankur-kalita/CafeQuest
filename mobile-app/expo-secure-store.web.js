// Web stub for expo-secure-store
// Uses localStorage as a fallback on web

export async function getItemAsync(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('getItemAsync failed:', e);
    return null;
  }
}

export async function setItemAsync(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('setItemAsync failed:', e);
  }
}

export async function deleteItemAsync(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('deleteItemAsync failed:', e);
  }
}

export default {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
};
