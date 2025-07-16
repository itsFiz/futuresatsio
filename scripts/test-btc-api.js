// Test script to verify the CoinGecko API integration
const http = require('http');

function makeRequest(hostname, port, path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      port: port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: JSON.parse(data)
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testBTCAPI() {
  console.log('🧪 Testing Bitcoin API integration...\n');
  
  try {
    // Test 1: Update Bitcoin data
    console.log('📡 Fetching fresh Bitcoin data...');
    const updateResult = await makeRequest('localhost', 3000, '/api/btc-data', 'POST');
    
    if (updateResult.statusCode === 200) {
      console.log('✅ Bitcoin data updated successfully!');
      console.log(`📊 Current BTC Price: $${updateResult.data.data.currentPrice.toLocaleString()}`);
      console.log(`💰 Market Cap: $${(updateResult.data.data.marketCap / 1e12).toFixed(2)}T`);
      console.log(`📈 24h Volume: $${(updateResult.data.data.volume / 1e9).toFixed(2)}B`);
      console.log(`🔄 Data Source: ${updateResult.data.source}`);
      console.log(`⏰ Last Updated: ${updateResult.data.data.lastUpdated}\n`);
    } else {
      console.error('❌ Failed to update Bitcoin data:', updateResult.statusCode);
      console.error('Response:', updateResult.data);
      return;
    }
    
    // Test 2: Get Bitcoin data
    console.log('📖 Retrieving stored Bitcoin data...');
    const getResult = await makeRequest('localhost', 3000, '/api/btc-data', 'GET');
    
    if (getResult.statusCode === 200) {
      console.log('✅ Bitcoin data retrieved successfully!');
      console.log(`📊 Stored BTC Price: $${getResult.data.currentPrice.toLocaleString()}`);
      console.log(`💰 Stored Market Cap: $${(getResult.data.marketCap / 1e12).toFixed(2)}T`);
      console.log(`📈 Stored Volume: $${(getResult.data.volume / 1e9).toFixed(2)}B`);
      console.log(`⏰ Stored Last Updated: ${getResult.data.lastUpdated}\n`);
    } else {
      console.error('❌ Failed to retrieve Bitcoin data:', getResult.statusCode);
      console.error('Response:', getResult.data);
    }
    
    // Test 3: Compare with CoinGecko directly
    console.log('🔍 Comparing with CoinGecko API directly...');
    const https = require('https');
    
    const coinGeckoRequest = new Promise((resolve, reject) => {
      https.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
    
    const coinGeckoData = await coinGeckoRequest;
    console.log('✅ CoinGecko API Response:');
    console.log(`📊 Direct BTC Price: $${coinGeckoData.bitcoin.usd.toLocaleString()}`);
    console.log(`💰 Direct Market Cap: $${(coinGeckoData.bitcoin.usd_market_cap / 1e12).toFixed(2)}T`);
    console.log(`📈 Direct Volume: $${(coinGeckoData.bitcoin.usd_24h_vol / 1e9).toFixed(2)}B`);
    
    // Compare prices
    const priceDiff = Math.abs(updateResult.data.data.currentPrice - coinGeckoData.bitcoin.usd);
    console.log(`\n🔄 Price Difference: $${priceDiff.toFixed(2)}`);
    
    if (priceDiff < 1) {
      console.log('🎉 Perfect! Prices match closely.');
    } else if (priceDiff < 100) {
      console.log('✅ Good! Prices are very close.');
    } else {
      console.log('⚠️  Warning: Prices differ significantly.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('💡 Make sure your development server is running: npm run dev');
  }
}

testBTCAPI(); 