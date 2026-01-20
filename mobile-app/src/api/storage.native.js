// Native storage implementation using expo-secure-store
import * as SecureStore from 'expo-secure-store';

const storage = {
  getItemAsync: SecureStore.getItemAsync,
  setItemAsync: SecureStore.setItemAsync,
  deleteItemAsync: SecureStore.deleteItemAsync,
};

export default storage;
