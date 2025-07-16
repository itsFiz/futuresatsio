import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      targetYear,
      startingBTC,
      monthlyDCA,
      dcaGrowthRate,
      btcCAGR,
      currentYear,
      finalBTC,
      finalValue,
      totalInvested,
      roiMultiplier,
      userId,
    } = body;

    // Validate required fields
    if (!name || !targetYear || !monthlyDCA || !btcCAGR || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create retirement plan
    const plan = await prisma.retirementPlan.create({
      data: {
        name,
        description,
        targetYear,
        startingBTC,
        monthlyDCA,
        dcaGrowthRate,
        btcCAGR,
        currentYear,
        finalBTC,
        finalValue,
        totalInvested,
        roiMultiplier,
        userId,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error('Error creating retirement plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const plans = await prisma.retirementPlan.findMany({
      where: { userId },
      include: {
        dipBuys: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching retirement plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 