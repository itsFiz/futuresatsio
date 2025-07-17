#!/usr/bin/env node

/**
 * Test production API endpoints
 * Run with: node scripts/test-production-api.js
 */

async function testProductionAPI() {
  console.log('🧪 Testing production API endpoints...\n');

  // Test GET endpoint
  try {
    console.log('📡 Testing GET /api/btc-data...');
    const getResponse = await fetch('https://your-app-name.vercel.app/api/btc-data');
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ GET endpoint working');
      console.log(`   Price: $${data.currentPrice?.toLocaleString() || 'N/A'}`);
      console.log(`   Last updated: ${data.lastUpdated || 'N/A'}`);
    } else {
      console.log(`❌ GET endpoint failed: ${getResponse.status} ${getResponse.statusText}`);
    }
  } catch (error) {
    console.log(`❌ GET endpoint error: ${error.message}`);
  }

  // Test POST endpoint
  try {
    console.log('\n📡 Testing POST /api/btc-data...');
    const postResponse = await fetch('https://your-app-name.vercel.app/api/btc-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (postResponse.ok) {
      const result = await postResponse.json();
      console.log('✅ POST endpoint working');
      console.log(`   Source: ${result.source || 'unknown'}`);
      console.log(`   Price: $${result.data?.currentPrice?.toLocaleString() || 'N/A'}`);
    } else {
      console.log(`❌ POST endpoint failed: ${postResponse.status} ${postResponse.statusText}`);
    }
  } catch (error) {
    console.log(`❌ POST endpoint error: ${error.message}`);
  }

  console.log('\n📋 Instructions:');
  console.log('1. Replace "your-app-name" with your actual Vercel app name');
  console.log('2. Run this script after deploying to production');
  console.log('3. Check that both endpoints return valid data');
}

testProductionAPI(); 