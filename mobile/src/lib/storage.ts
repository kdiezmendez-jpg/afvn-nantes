import AsyncStorage from "@react-native-async-storage/async-storage";

// Stockage local de préférences (rappels). Reste sur le téléphone.
const storage = {
  async get(key: string) {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async set(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
};

export default storage;
