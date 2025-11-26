import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Conversion } from '../types';

const STORAGE_KEYS = {
  USER: '@currency_app_user',
  CONVERSIONS: '@currency_app_conversions',
};

export const storageService = {
  // Usuario
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  },

  // Conversiones
  async saveConversion(conversion: Conversion): Promise<void> {
    try {
      const conversions = await this.getConversions();
      conversions.unshift(conversion); // Agregar al inicio
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSIONS, JSON.stringify(conversions));
    } catch (error) {
      console.error('Error saving conversion:', error);
      throw error;
    }
  },

  async getConversions(): Promise<Conversion[]> {
    try {
      const conversionsData = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSIONS);
      return conversionsData ? JSON.parse(conversionsData) : [];
    } catch (error) {
      console.error('Error getting conversions:', error);
      return [];
    }
  },

  async clearConversions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CONVERSIONS);
    } catch (error) {
      console.error('Error clearing conversions:', error);
      throw error;
    }
  },
};
