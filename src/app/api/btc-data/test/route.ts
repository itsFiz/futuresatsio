import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'BTC Data API is working!',
    timestamp: new Date().toISOString()
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'BTC Data POST endpoint is working!',
    timestamp: new Date().toISOString()
  });
} 