import axios from "axios";

export interface BitcoinPriceData {
  price: number;
  currency: string;
  timestamp: string;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
  volume: number;
  marketCap: number;
}

export interface MarketAnalysis {
  currentPrice: number;
  trend: "bullish" | "bearish" | "neutral";
  supportLevel: number;
  resistanceLevel: number;
  volatility: number;
  recommendation: string;
}

export class BitcoinDataService {
  private baseUrl = "https://api.coingecko.com/api/v3";

  async getCurrentPrice(currency: string = "USD"): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/simple/price`, {
        params: {
          ids: "bitcoin",
          vs_currencies: currency.toLowerCase(),
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true
        }
      });

      const data = response.data.bitcoin;
      const price = data[currency.toLowerCase()];
      const change24h = data[`${currency.toLowerCase()}_24h_change`];
      const marketCap = data[`${currency.toLowerCase()}_market_cap`];
      const volume24h = data[`${currency.toLowerCase()}_24h_vol`];

      const result: BitcoinPriceData = {
        price,
        currency: currency.toUpperCase(),
        timestamp: new Date().toISOString(),
        change24h,
        marketCap,
        volume24h
      };

      return {
        content: [
          {
            type: "text",
            text: `Current Bitcoin price: ${price.toLocaleString()} ${currency.toUpperCase()}\n24h Change: ${change24h.toFixed(2)}%\nMarket Cap: ${marketCap.toLocaleString()} ${currency.toUpperCase()}\n24h Volume: ${volume24h.toLocaleString()} ${currency.toUpperCase()}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to fetch Bitcoin price: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getHistoricalData(days: number = 30, currency: string = "USD"): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/coins/bitcoin/market_chart`, {
        params: {
          vs_currency: currency.toLowerCase(),
          days: days,
          interval: "daily"
        }
      });

      const prices = response.data.prices;
      const volumes = response.data.total_volumes;
      const marketCaps = response.data.market_caps;

      const historicalData: HistoricalDataPoint[] = prices.map((priceData: [number, number], index: number) => ({
        date: new Date(priceData[0]).toISOString().split('T')[0],
        price: priceData[1],
        volume: volumes[index]?.[1] || 0,
        marketCap: marketCaps[index]?.[1] || 0
      }));

      const latestPrice = historicalData[historicalData.length - 1].price;
      const earliestPrice = historicalData[0].price;
      const totalChange = ((latestPrice - earliestPrice) / earliestPrice) * 100;

      return {
        content: [
          {
            type: "text",
            text: `Historical Bitcoin data for the last ${days} days:\n` +
                  `Current Price: ${latestPrice.toLocaleString()} ${currency.toUpperCase()}\n` +
                  `Price ${days} days ago: ${earliestPrice.toLocaleString()} ${currency.toUpperCase()}\n` +
                  `Total Change: ${totalChange.toFixed(2)}%\n` +
                  `Data points: ${historicalData.length}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to fetch historical data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMarketAnalysis(currency: string = "USD"): Promise<any> {
    try {
      // Get current price and 30-day historical data
      const currentPriceResponse = await axios.get(`${this.baseUrl}/simple/price`, {
        params: {
          ids: "bitcoin",
          vs_currencies: currency.toLowerCase(),
          include_24hr_change: true
        }
      });

      const historicalResponse = await axios.get(`${this.baseUrl}/coins/bitcoin/market_chart`, {
        params: {
          vs_currency: currency.toLowerCase(),
          days: 30,
          interval: "daily"
        }
      });

      const currentPrice = currentPriceResponse.data.bitcoin[currency.toLowerCase()];
      const change24h = currentPriceResponse.data.bitcoin[`${currency.toLowerCase()}_24h_change`];
      const prices = historicalResponse.data.prices.map((p: [number, number]) => p[1]);

      // Calculate volatility (standard deviation of returns)
      const returns = [];
      for (let i = 1; i < prices.length; i++) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
      }
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
      const volatility = Math.sqrt(variance) * 100;

      // Determine trend
      const trend = change24h > 5 ? "bullish" : change24h < -5 ? "bearish" : "neutral";

      // Simple support/resistance levels
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const supportLevel = minPrice * 0.95;
      const resistanceLevel = maxPrice * 1.05;

      // Generate recommendation
      let recommendation = "";
      if (trend === "bullish") {
        recommendation = "Market showing bullish momentum. Consider DCA strategy.";
      } else if (trend === "bearish") {
        recommendation = "Market showing bearish momentum. Good opportunity for dip buying.";
      } else {
        recommendation = "Market is neutral. Continue with regular DCA strategy.";
      }

      const analysis: MarketAnalysis = {
        currentPrice,
        trend,
        supportLevel,
        resistanceLevel,
        volatility,
        recommendation
      };

      return {
        content: [
          {
            type: "text",
            text: `Market Analysis:\n` +
                  `Current Price: ${currentPrice.toLocaleString()} ${currency.toUpperCase()}\n` +
                  `24h Change: ${change24h.toFixed(2)}%\n` +
                  `Trend: ${trend.toUpperCase()}\n` +
                  `Volatility: ${volatility.toFixed(2)}%\n` +
                  `Support Level: ${supportLevel.toLocaleString()} ${currency.toUpperCase()}\n` +
                  `Resistance Level: ${resistanceLevel.toLocaleString()} ${currency.toUpperCase()}\n` +
                  `Recommendation: ${recommendation}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to analyze market: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 