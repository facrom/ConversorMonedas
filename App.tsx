import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import ConversionScreen from './screens/ConversionScreen';
import HistoryScreen from './screens/HistoryScreen';
import { storageService } from './services/storageService';

type Screen = 'login' | 'conversion' | 'history';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const user = await storageService.getUser();
      if (user) {
        setCurrentScreen('conversion');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setCurrentScreen('conversion');
  };

  const handleLogout = async () => {
    try {
      await storageService.removeUser();
      setCurrentScreen('login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNavigateToHistory = () => {
    setCurrentScreen('history');
  };

  const handleNavigateBack = () => {
    setCurrentScreen('conversion');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}
      
      {currentScreen === 'conversion' && (
        <ConversionScreen
          onNavigateToHistory={handleNavigateToHistory}
          onLogout={handleLogout}
        />
      )}
      
      {currentScreen === 'history' && (
        <HistoryScreen onNavigateBack={handleNavigateBack} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

