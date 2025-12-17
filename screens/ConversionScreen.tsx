import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { currencyService } from '../services/currencyService';
import { storageService } from '../services/storageService';
import { Conversion } from '../types';
import CustomAlert from '../components/CustomAlert';

interface ConversionScreenProps {
  onNavigateToHistory: () => void;
  onLogout: () => void;
}

export default function ConversionScreen({
  onNavigateToHistory,
  onLogout,
}: ConversionScreenProps) {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const currencies = currencyService.getPopularCurrencies();

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showAlert('Error', 'Por favor ingresa una cantidad válida');
      return;
    }

    if (fromCurrency === toCurrency) {
      showAlert('Error', 'Selecciona monedas diferentes');
      return;
    }

    setLoading(true);
    try {
      const { result: convertedAmount, rate } = await currencyService.convertCurrency(
        fromCurrency,
        toCurrency,
        parseFloat(amount)
      );

      setResult(convertedAmount);

      // Guardar conversión en el historial
      const conversion: Conversion = {
        id: Date.now().toString(),
        from: fromCurrency,
        to: toCurrency,
        amount: parseFloat(amount),
        result: convertedAmount,
        rate,
        date: new Date().toISOString(),
      };

      await storageService.saveConversion(conversion);
    } catch (error) {
      showAlert('Error', 'No se pudo realizar la conversión. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💱 Conversor</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={onNavigateToHistory}>
            <Text style={styles.headerButtonText}>📊 Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.logoutButton]}
            onPress={onLogout}
          >
            <Text style={styles.headerButtonText}>🚪 Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Cantidad</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>De</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fromCurrency}
              onValueChange={(itemValue) => {
                setFromCurrency(itemValue);
                setResult(null);
              }}
              style={styles.picker}
            >
              {currencies.map((currency) => (
                <Picker.Item
                  key={currency.code}
                  label={`${currency.code} - ${currency.name}`}
                  value={currency.code}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={handleSwapCurrencies}>
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>

          <Text style={styles.label}>A</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={toCurrency}
              onValueChange={(itemValue) => {
                setToCurrency(itemValue);
                setResult(null);
              }}
              style={styles.picker}
            >
              {currencies.map((currency) => (
                <Picker.Item
                  key={currency.code}
                  label={`${currency.code} - ${currency.name}`}
                  value={currency.code}
                />
              ))}
            </Picker>
          </View>
        </View>

        {result !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Resultado</Text>
            <Text style={styles.resultText}>
              {result.toFixed(2)} {toCurrency}
            </Text>
            <Text style={styles.resultSubtext}>
              {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.convertButton, loading && styles.buttonDisabled]}
          onPress={handleConvert}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.convertButtonText}>Convertir</Text>
          )}
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  headerButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  amountInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  swapIcon: {
    fontSize: 24,
    color: 'white',
  },
  resultContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  resultSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  convertButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  convertButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
