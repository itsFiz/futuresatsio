const fetch = require('node-fetch');

async function initializeBitcoinData() {
  console.log('Initializing Bitcoin data...');
  
  try {
    const response = await fetch('http://localhost:3000/api/btc-data', {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Bitcoin data initialized successfully!');
    console.log(`Current BTC Price: $${result.data.currentPrice.toFixed(2)}`);
    console.log(`Market Cap: $${result.data.marketCap.toLocaleString()}`);
    console.log(`Last Updated: ${result.data.lastUpdated}`);
    
  } catch (error) {
    console.error('Failed to initialize Bitcoin data:', error.message);
    console.log('Make sure your development server is running (npm run dev)');
    process.exit(1);
  }
}

initializeBitcoinData(); 