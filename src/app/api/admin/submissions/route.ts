import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { SubmissionStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // RBAC: Only allow admins
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const where = status ? { status: status as SubmissionStatus } : {};

    const [submissions, total] = await Promise.all([
      prisma.modelSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          modelName: true,
          authorName: true,
          email: true,
          xHandle: true,
          description: true,
          thesis: true,
          startingPrice: true,
          cagrValues: true,
          methodology: true,
          expectedOutcome: true,
          status: true,
          createdAt: true,
          reviewedAt: true,
        },
      }),
      prisma.modelSubmission.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
} 