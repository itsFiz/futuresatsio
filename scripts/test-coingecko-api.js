#!/usr/bin/env node

/**
 * Test script to check CoinGecko API status and rate limits
 * Run with: node scripts/test-coingecko-api.js
 */

async function testCoinGeckoAPI() {
  console.log('🔍 Testing CoinGecko API...\n');

  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true';
  
  try {
    console.log('📡 Making request to CoinGecko API...');
    
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FutureSats-App/1.0',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    const endTime = Date.now();
    
    console.log(`⏱️  Response time: ${endTime - startTime}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    // Check rate limit headers
    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
    const rateLimitReset = response.headers.get('x-ratelimit-reset');
    
    if (rateLimitRemaining) {
      console.log(`🔄 Rate limit remaining: ${rateLimitRemaining}`);
    }
    if (rateLimitReset) {
      console.log(`⏰ Rate limit reset: ${rateLimitReset}`);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error response: ${errorText}`);
      
      if (response.status === 429) {
        console.log('\n🚨 RATE LIMITED! This is likely the issue.');
        console.log('💡 Solutions:');
        console.log('   - Wait a few minutes before trying again');
        console.log('   - Consider upgrading to CoinGecko Pro for higher limits');
        console.log('   - Implement exponential backoff in your app');
      }
      return;
    }
    
    const data = await response.json();
    console.log('\n✅ Success! Bitcoin data:');
    console.log(`   Price: $${data.bitcoin.usd.toLocaleString()}`);
    console.log(`   Market Cap: $${data.bitcoin.usd_market_cap.toLocaleString()}`);
    console.log(`   24h Volume: $${data.bitcoin.usd_24h_vol.toLocaleString()}`);
    console.log(`   24h Change: ${data.bitcoin.usd_24h_change.toFixed(2)}%`);
    
    console.log('\n🎯 API is working correctly!');
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\n💡 Possible issues:');
    console.log('   - Network connectivity problem');
    console.log('   - DNS resolution issue');
    console.log('   - Firewall blocking the request');
  }
}

// Test multiple requests to check rate limiting
async function testRateLimiting() {
  console.log('\n🔄 Testing rate limiting with multiple requests...\n');
  
  for (let i = 1; i <= 5; i++) {
    console.log(`Request ${i}/5:`);
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      console.log(`  Status: ${response.status}`);
      
      if (response.status === 429) {
        console.log('  🚨 Rate limited!');
        break;
      }
      
      const data = await response.json();
      console.log(`  Price: $${data.bitcoin.usd.toLocaleString()}`);
      
      // Wait 1 second between requests
      if (i < 5) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
}

// Run tests
async function main() {
  await testCoinGeckoAPI();
  await testRateLimiting();
  
  console.log('\n📋 Summary:');
  console.log('If you see rate limiting (429 errors), that explains why your app');
  console.log('isn\'t getting fresh data. The improvements I made should help by:');
  console.log('1. Adding proper error handling for rate limits');
  console.log('2. Using cache-busting parameters');
  console.log('3. Adding timeout to prevent hanging requests');
  console.log('4. Better user feedback about data source');
}

main().catch(console.error); 