import { useEffect, useState } from "react";

const SUPPORTED = [
  "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SGD", "HKD", "INR", "MYR"
];

// Fallback rates (approximate as of 2024)
const FALLBACK_RATES: Record<string, number> = {
  USD: 0.21,    // 1 MYR = 0.21 USD
  EUR: 0.19,    // 1 MYR = 0.19 EUR
  GBP: 0.17,    // 1 MYR = 0.17 GBP
  JPY: 31.5,    // 1 MYR = 31.5 JPY
  AUD: 0.32,    // 1 MYR = 0.32 AUD
  CAD: 0.29,    // 1 MYR = 0.29 CAD
  CHF: 0.18,    // 1 MYR = 0.18 CHF
  CNY: 1.52,    // 1 MYR = 1.52 CNY
  SGD: 0.28,    // 1 MYR = 0.28 SGD
  HKD: 1.64,    // 1 MYR = 1.64 HKD
  INR: 17.5,    // 1 MYR = 17.5 INR
  MYR: 1,       // 1 MYR = 1 MYR
};

export function useCurrency(selected: string = "MYR") {
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Use fallback rates immediately for better reliability
    console.log('Using fallback rates for immediate functionality');
    setRates(FALLBACK_RATES);
    setLoading(false);
    
    // Optionally try to fetch live rates in the background
    const fetchLiveRates = async () => {
      const apiEndpoints = [
        `https://api.exchangerate.host/latest?base=MYR&symbols=${SUPPORTED.join(",")}`,
        `https://api.exchangerate-api.com/v4/latest/MYR`,
        `https://open.er-api.com/v6/latest/MYR`
      ];
      
      for (const endpoint of apiEndpoints) {
        try {
          console.log('Trying API endpoint:', endpoint);
          const res = await fetch(endpoint);
          if (!res.ok) continue;
          
          const data = await res.json();
          console.log('API response:', data);
          
          if (data && data.rates) {
            setRates(data.rates);
            console.log('Live currency rates loaded successfully:', data.rates);
            return;
          } else if (data && data.conversion_rates) {
            // Different API format
            setRates(data.conversion_rates);
            console.log('Live currency rates loaded successfully:', data.conversion_rates);
            return;
          }
        } catch (err) {
          console.warn('API endpoint failed:', endpoint, err);
          continue;
        }
      }
      
      console.log('All APIs failed, keeping fallback rates');
    };
    
    // Fetch live rates in background (non-blocking)
    fetchLiveRates();
  }, []); // Only fetch once on mount

  function convert(amountMYR: number, to: string) {
    if (!amountMYR || isNaN(amountMYR)) return 0;
    if (to === "MYR") return amountMYR;
    
    const rate = rates[to];
    if (!rate || rate === 0) {
      console.warn(`No valid rate found for ${to}, using MYR`);
      return amountMYR;
    }
    
    const converted = amountMYR * rate;
    console.log(`Converting ${amountMYR} MYR to ${to}: ${converted} (rate: ${rate})`);
    return converted;
  }

  function format(amount: number, to: string) {
    if (!amount || isNaN(amount)) return "0";
    
    try {
      // Handle special cases for certain currencies
      const currencyCode = to.toUpperCase();
      const locale = getLocaleForCurrency(currencyCode);
      
      const formatted = amount.toLocaleString(locale, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      });
      
      console.log(`Formatting ${amount} to ${to}: ${formatted}`);
      return formatted;
    } catch (error) {
      console.error('Format error:', error);
      // Fallback formatting
      return `${to} ${amount.toLocaleString()}`;
    }
  }

  function getLocaleForCurrency(currency: string): string {
    const localeMap: Record<string, string> = {
      'USD': 'en-US',
      'EUR': 'de-DE',
      'GBP': 'en-GB',
      'JPY': 'ja-JP',
      'AUD': 'en-AU',
      'CAD': 'en-CA',
      'CHF': 'de-CH',
      'CNY': 'zh-CN',
      'SGD': 'en-SG',
      'HKD': 'zh-HK',
      'INR': 'en-IN',
      'MYR': 'ms-MY',
    };
    return localeMap[currency] || 'en-US';
  }

  console.log('useCurrency hook - selected:', selected, 'rates:', rates, 'loading:', loading); // Debug log
  console.log('Available currencies:', Object.keys(rates)); // Debug log
  return { rates, convert, format, loading, error };
} 