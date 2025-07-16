// Simple Bitcoin data initialization script
// Run this with: node scripts/init-btc-data-simple.js

const http = require('http');

function makePostRequest(hostname, port, path) {
  return new Promise((resolve, reject) => {
    const postData = '';
    
    const options = {
      hostname: hostname,
      port: port,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
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
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function initializeBitcoinData() {
  console.log('🚀 Initializing Bitcoin data...');
  
  try {
    const result = await makePostRequest('localhost', 3000, '/api/btc-data');
    
    if (result.statusCode === 200) {
      const responseData = JSON.parse(result.data);
      console.log('✅ Bitcoin data initialized successfully!');
      console.log(`📊 Current BTC Price: $${responseData.data.currentPrice.toFixed(2)}`);
      console.log(`💰 Market Cap: $${responseData.data.marketCap.toLocaleString()}`);
      console.log(`📅 Last Updated: ${responseData.data.lastUpdated}`);
      console.log(`🔄 Data Source: ${responseData.source || 'coingecko'}`);
    } else {
      console.error('❌ Failed to initialize Bitcoin data:', result.statusCode);
      console.error('Response:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error initializing Bitcoin data:', error.message);
    console.log('💡 Make sure your development server is running:');
    console.log('   npm run dev');
    process.exit(1);
  }
}

initializeBitcoinData(); 