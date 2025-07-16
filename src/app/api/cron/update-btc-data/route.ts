import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron job (basic security)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Cron job started: Updating Bitcoin data...');
    
    // Call our BTC data update endpoint
    const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/btc-data`, {
      method: 'POST',
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update Bitcoin data');
    }

    const result = await updateResponse.json();
    
    console.log('Cron job completed successfully');
    return NextResponse.json({ 
      message: 'Bitcoin data updated successfully via cron',
      timestamp: new Date().toISOString(),
      data: result.data 
    });
    
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ 
      error: 'Cron job failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Allow POST requests as well for manual triggering
  return GET(request);
} 