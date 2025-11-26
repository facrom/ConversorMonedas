export interface User {
  username: string;
  email: string;
}

export interface Conversion {
  id: string;
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
}

export interface CurrencyRates {
  [key: string]: number;
}

export interface ExchangeRateResponse {
  result: string;
  conversion_rates: CurrencyRates;
  base_code: string;
  time_last_update_unix: number;
}
