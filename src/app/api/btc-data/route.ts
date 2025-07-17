import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CoinGeckoData {
  bitcoin: {
    usd: number;
    usd_market_cap: number;
    usd_24h_vol: number;
    usd_24h_change: number;
  };
  lastUpdated: string;
}

interface BTCMarketData {
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

async function fetchCoinGeckoData(): Promise<CoinGeckoData> {
  console.log('Fetching CoinGecko data...');
  try {
    // Add cache-busting parameter and proper headers
    const timestamp = Date.now();
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&_t=${timestamp}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FutureSats-App/1.0',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinGecko API error:', response.status, response.statusText, errorText);
      
      // Handle specific rate limiting
      if (response.status === 429) {
        throw new Error('Rate limited by CoinGecko API. Please try again later.');
      }
      
      throw new Error(`Failed to fetch CoinGecko data: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate the response structure
    if (!data.bitcoin || typeof data.bitcoin.usd !== 'number') {
      throw new Error('Invalid response structure from CoinGecko API');
    }
    
    console.log('Successfully fetched CoinGecko data:', {
      price: data.bitcoin.usd,
      marketCap: data.bitcoin.usd_market_cap,
      volume: data.bitcoin.usd_24h_vol
    });
    
    return {
      bitcoin: data.bitcoin,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in fetchCoinGeckoData:', error);
    throw error;
  }
}

async function processCoinGeckoData(rawData: CoinGeckoData): Promise<BTCMarketData> {
  const btcData = rawData.bitcoin;
  
  // Direct price data from CoinGecko API
  const currentPrice = btcData.usd;
  const marketCap = btcData.usd_market_cap;
  const volume = btcData.usd_24h_vol;
  const timestamp = Date.now();
  
  // Create a simple price history entry (since we only have current data)
  const priceHistory = [{
    timestamp,
    price: currentPrice,
    marketCap,
    volume
  }];

  return {
    currentPrice,
    marketCap,
    volume,
    lastUpdated: rawData.lastUpdated,
    priceHistory
  };
}

function createFallbackData(): BTCMarketData {
  const currentPrice = 118810; // Fallback price (closer to recent CoinGecko data)
  const marketCap = currentPrice * 19700000; // Approximate market cap calculation
  const volume = 22000000000; // Fallback volume (based on typical BTC 24h volume)
  const now = Date.now();
  
  return {
    currentPrice,
    marketCap,
    volume,
    lastUpdated: new Date().toISOString(),
    priceHistory: [
      {
        timestamp: now,
        price: currentPrice,
        marketCap,
        volume
      }
    ]
  };
}

async function saveBTCDataToDatabase(data: BTCMarketData, source: string): Promise<void> {
  try {
    // First, deactivate all existing records
    await prisma.bTCMarketData.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Create new active record
    await prisma.bTCMarketData.create({
      data: {
        currentPrice: data.currentPrice,
        marketCap: data.marketCap,
        volume: data.volume,
        lastUpdated: data.lastUpdated,
        priceHistory: data.priceHistory,
        dataSource: source,
        isActive: true
      }
    });

    console.log('Bitcoin data saved to database successfully');
  } catch (error) {
    console.error('Error saving BTC data to database:', error);
    throw error;
  }
}

async function loadBTCDataFromDatabase(): Promise<BTCMarketData | null> {
  try {
    const record = await prisma.bTCMarketData.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    if (!record) {
      return null;
    }

    return {
      currentPrice: record.currentPrice,
      marketCap: record.marketCap,
      volume: record.volume,
      lastUpdated: record.lastUpdated,
      priceHistory: record.priceHistory as BTCMarketData['priceHistory']
    };
  } catch (error) {
    console.error('Error loading BTC data from database:', error);
    return null;
  }
}

export async function GET() {
  try {
    const data = await loadBTCDataFromDatabase();
    if (!data) {
      // Return a fallback response instead of 404
      return NextResponse.json({ 
        error: 'No data available',
        message: 'Bitcoin data not initialized. Use POST /api/btc-data to fetch initial data.'
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error loading BTC data:', error);
    return NextResponse.json({ 
      error: 'Failed to load data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('POST /api/btc-data - Fetching fresh Bitcoin data from CoinGecko...');
    
    let processedData: BTCMarketData;
    let dataSource = 'unknown';
    
    try {
      const rawData = await fetchCoinGeckoData();
      processedData = await processCoinGeckoData(rawData);
      dataSource = 'coingecko';
      console.log('Successfully fetched live Bitcoin data from CoinGecko');
    } catch (coinGeckoError) {
      console.warn('CoinGecko API failed, using fallback data:', coinGeckoError);
      processedData = createFallbackData();
      dataSource = 'fallback';
    }
    
    await saveBTCDataToDatabase(processedData, dataSource);
    
    console.log('Bitcoin data updated successfully');
    return NextResponse.json({ 
      message: 'Bitcoin data updated successfully',
      data: processedData,
      source: dataSource,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error updating BTC data:', error);
    return NextResponse.json({ 
      error: 'Failed to update data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 