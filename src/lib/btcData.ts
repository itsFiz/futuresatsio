export interface BTCMarketData {
  currentPrice: number;
  marketCap: number;
  volume: number;
  lastUpdated: string;
  priceHistory: {
    timestamp: number;
    price: number;
    marketCap: number;
    volume: number;
  }[];
}

export interface CAGRModel {
  name: string;
  cagr: number[];
  startPrice: number;
  desc: string;
  isRealTime?: boolean;
}

export async function fetchBTCData(): Promise<BTCMarketData | null> {
  try {
    const response = await fetch('/api/btc-data');
    if (!response.ok) {
      console.error('Failed to fetch BTC data:', response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    
    // Check if the response indicates no data is available
    if (data.error) {
      console.warn('BTC data not available:', data.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching BTC data:', error);
    return null;
  }
}

export function calculateCAGRFromPrice(
  currentPrice: number,
  targetCAGR: number,
  years: number
): number[] {
  const cagr: number[] = [];
  for (let i = 0; i < years; i++) {
    // Gradually decrease CAGR over time
    const adjustedCAGR = targetCAGR * Math.pow(0.95, i);
    cagr.push(Math.max(adjustedCAGR, 5)); // Minimum 5% CAGR
  }
  return cagr;
}

export function createRealTimeModel(
  btcData: BTCMarketData | null,
  modelName: string = "Real-Time"
): CAGRModel | null {
  if (!btcData) return null;

  // Calculate a reasonable CAGR based on historical performance
  // Using a conservative approach starting from current price
  const baseCAGR = 25; // Starting CAGR %
  const years = 30;
  const cagr = calculateCAGRFromPrice(btcData.currentPrice, baseCAGR, years);

  return {
    name: modelName,
    cagr,
    startPrice: btcData.currentPrice,
    desc: `Real-time model based on current BTC price: $${btcData.currentPrice.toFixed(2)}`,
    isRealTime: true
  };
}

export function calculateTrueMarketMean(priceHistory: BTCMarketData['priceHistory']): number {
  if (!priceHistory || priceHistory.length === 0) return 0;
  
  // Calculate the mean price over the available history
  const sum = priceHistory.reduce((acc, point) => acc + point.price, 0);
  return sum / priceHistory.length;
}

export function updateCAGRModels(
  originalModels: CAGRModel[],
  btcData: BTCMarketData | null
): CAGRModel[] {
  const models = [...originalModels];
  
  if (btcData) {
    // Update existing models with real-time starting price
    const trueMarketMean = calculateTrueMarketMean(btcData.priceHistory);
    const currentPrice = btcData.currentPrice;
    
    // Use current price or true market mean, whichever is more conservative
    const basePrice = Math.min(currentPrice, trueMarketMean || currentPrice);
    
    // Update the first few models to use real-time data
    models.forEach((model, index) => {
      if (index < 4) { // Update first 4 models
        model.startPrice = basePrice;
        model.desc = `${model.desc.split(',')[0]}, updated with real-time price: $${basePrice.toFixed(2)}`;
      }
    });
    
    // Add a real-time model
    const realTimeModel = createRealTimeModel(btcData);
    if (realTimeModel) {
      models.push(realTimeModel);
    }
  }
  
  return models;
} 