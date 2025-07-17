#!/usr/bin/env node

/**
 * Initialize Bitcoin data in the database
 * Run with: node scripts/init-btc-db.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initializeBTCData() {
  try {
    console.log('🔧 Initializing Bitcoin data in database...');

    // Check if we already have data
    const existingData = await prisma.bTCMarketData.findFirst({
      where: { isActive: true }
    });

    if (existingData) {
      console.log('✅ Bitcoin data already exists in database');
      console.log(`   Current price: $${existingData.currentPrice.toLocaleString()}`);
      console.log(`   Last updated: ${existingData.lastUpdated}`);
      console.log(`   Data source: ${existingData.dataSource}`);
      return;
    }

    // Create initial fallback data
    const fallbackData = {
      currentPrice: 118810,
      marketCap: 118810 * 19700000,
      volume: 22000000000,
      lastUpdated: new Date().toISOString(),
      priceHistory: [{
        timestamp: Date.now(),
        price: 118810,
        marketCap: 118810 * 19700000,
        volume: 22000000000
      }],
      dataSource: 'fallback',
      isActive: true
    };

    await prisma.bTCMarketData.create({
      data: fallbackData
    });

    console.log('✅ Bitcoin data initialized successfully');
    console.log(`   Price: $${fallbackData.currentPrice.toLocaleString()}`);
    console.log(`   Data source: ${fallbackData.dataSource}`);

  } catch (error) {
    console.error('❌ Error initializing Bitcoin data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
initializeBTCData(); 