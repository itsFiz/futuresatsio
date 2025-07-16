import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Call the main BTC data endpoint to initialize data
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/btc-data`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to initialize Bitcoin data');
    }

    const result = await response.json();
    
    return NextResponse.json({
      message: 'Bitcoin data initialized successfully',
      data: result.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error initializing Bitcoin data:', error);
    return NextResponse.json({
      error: 'Failed to initialize Bitcoin data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Bitcoin data initialization endpoint',
    instructions: 'Use POST to initialize Bitcoin data',
    timestamp: new Date().toISOString()
  });
} 