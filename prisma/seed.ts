import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'demo@futuresats.io' },
    update: {},
    create: {
      email: 'demo@futuresats.io',
      name: 'Demo User',
      isPro: true,
      planCount: 1,
    },
  });

  // Create a sample retirement plan
  const retirementPlan = await prisma.retirementPlan.upsert({
    where: { id: 'demo-plan-1' },
    update: {},
    create: {
      id: 'demo-plan-1',
      name: 'My 2055 BTC Retirement',
      description: 'Sample retirement plan targeting 5 BTC by 2055',
      targetYear: 2055,
      startingBTC: 1.0,
      monthlyDCA: 5000,
      dcaGrowthRate: 150,
      btcCAGR: 20,
      currentYear: 2025,
      finalBTC: 4.77,
      finalValue: 130200000,
      totalInvested: 15180000,
      roiMultiplier: 8.6,
      userId: user.id,
    },
  });

  // Create sample dip buys
  const dipBuys = [
    {
      year: 2039,
      amount: 1000000,
      btcPrice: 150000,
    },
    {
      year: 2043,
      amount: 1500000,
      btcPrice: 200000,
    },
    {
      year: 2047,
      amount: 2000000,
      btcPrice: 250000,
    },
  ];

  for (const dipBuy of dipBuys) {
    await prisma.dipBuy.upsert({
      where: { 
        id: `dip-${dipBuy.year}` 
      },
      update: {},
      create: {
        id: `dip-${dipBuy.year}`,
        year: dipBuy.year,
        amount: dipBuy.amount,
        btcPrice: dipBuy.btcPrice,
        userId: user.id,
        planId: retirementPlan.id,
      },
    });
  }

  // Create sample simulation data
  const simulationData = [];
  let btcAccumulated = 1.0;
  let totalInvested = 0;
  let monthlyDCA = 5000;

  for (let year = 2025; year <= 2055; year++) {
    const yearlyDCA = monthlyDCA * 12;
    const btcPrice = Math.pow(1.2, year - 2025) * 50000; // 20% CAGR
    const btcGained = yearlyDCA / btcPrice;
    
    btcAccumulated += btcGained;
    totalInvested += yearlyDCA;
    monthlyDCA += 150; // Growth rate
    
    // Add dip buys for specific years
    if (year === 2039) {
      const dipBTC = 1000000 / 150000;
      btcAccumulated += dipBTC;
      totalInvested += 1000000;
    }
    if (year === 2043) {
      const dipBTC = 1500000 / 200000;
      btcAccumulated += dipBTC;
      totalInvested += 1500000;
    }
    if (year === 2047) {
      const dipBTC = 2000000 / 250000;
      btcAccumulated += dipBTC;
      totalInvested += 2000000;
    }
    
    simulationData.push({
      year,
      btcAccumulated: parseFloat(btcAccumulated.toFixed(4)),
      portfolioValue: Math.round(btcAccumulated * btcPrice),
      totalInvested: Math.round(totalInvested),
      btcPrice: Math.round(btcPrice),
      planId: retirementPlan.id,
    });
  }

  for (const data of simulationData) {
    await prisma.simulationData.upsert({
      where: { 
        id: `sim-${data.year}-${retirementPlan.id}` 
      },
      update: {},
      create: {
        id: `sim-${data.year}-${retirementPlan.id}`,
        year: data.year,
        btcAccumulated: data.btcAccumulated,
        portfolioValue: data.portfolioValue,
        totalInvested: data.totalInvested,
        btcPrice: data.btcPrice,
        planId: retirementPlan.id,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Created user: ${user.email}`);
  console.log(`📊 Created retirement plan: ${retirementPlan.name}`);
  console.log(`📈 Created ${dipBuys.length} dip buys`);
  console.log(`📊 Created ${simulationData.length} simulation data points`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 