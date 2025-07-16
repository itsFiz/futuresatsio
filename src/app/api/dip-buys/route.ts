import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, amount, btcPrice, userId, planId } = body;

    // Validate required fields
    if (!year || !amount || !btcPrice || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create dip buy
    const dipBuy = await prisma.dipBuy.create({
      data: {
        year,
        amount,
        btcPrice,
        userId,
        planId,
      },
    });

    return NextResponse.json(dipBuy, { status: 201 });
  } catch (error) {
    console.error('Error creating dip buy:', error);
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
    const planId = searchParams.get('planId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const where: Prisma.DipBuyWhereInput = { userId };
    if (planId) {
      where.planId = planId;
    }

    const dipBuys = await prisma.dipBuy.findMany({
      where,
      orderBy: { year: 'asc' },
    });

    return NextResponse.json(dipBuys);
  } catch (error) {
    console.error('Error fetching dip buys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Dip buy ID is required' },
        { status: 400 }
      );
    }

    await prisma.dipBuy.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Dip buy deleted successfully' });
  } catch (error) {
    console.error('Error deleting dip buy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 