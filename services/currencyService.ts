import axios from 'axios';
import { ExchangeRateResponse } from '../types';

// API gratuita de ExchangeRate-API
const API_KEY = 'YOUR_API_KEY'; // Puedes obtener una gratis en https://www.exchangerate-api.com/
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

// API alternativa gratuita sin necesidad de key (con límites)
const FREE_API_URL = 'https://api.exchangerate-api.com/v4/latest';

export const currencyService = {
  // Obtener tasas de cambio para una moneda base
  async getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRateResponse> {
    try {
      // Usando API gratuita sin key
      const response = await axios.get(`${FREE_API_URL}/${baseCurrency}`);
      return {
        result: 'success',
        conversion_rates: response.data.rates,
        base_code: response.data.base,
        time_last_update_unix: response.data.time_last_updated || Date.now() / 1000,
      };
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw new Error('No se pudo obtener las tasas de cambio');
    }
  },

  // Convertir moneda
  async convertCurrency(
    from: string,
    to: string,
    amount: number
  ): Promise<{ result: number; rate: number }> {
    try {
      const rates = await this.getExchangeRates(from);
      const rate = rates.conversion_rates[to];
      
      if (!rate) {
        throw new Error('Moneda no encontrada');
      }

      const result = amount * rate;
      return { result, rate };
    } catch (error) {
      console.error('Error converting currency:', error);
      throw error;
    }
  },

  // Lista de monedas populares
  getPopularCurrencies() {
    return [
      { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
      { code: 'JPY', name: 'Yen Japonés', symbol: '¥' },
      { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$' },
      { code: 'CAD', name: 'Dólar Canadiense', symbol: 'C$' },
      { code: 'CHF', name: 'Franco Suizo', symbol: 'Fr' },
      { code: 'CNY', name: 'Yuan Chino', symbol: '¥' },
      { code: 'BRL', name: 'Real Brasileño', symbol: 'R$' },
      { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
      { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
      { code: 'PYG', name: 'Guaraní Paraguayo', symbol: '₲' },
    ];
  },
};
