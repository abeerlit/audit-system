import { NextResponse } from 'next/server';
import prisma from '../../../../config/prisma';
import jwt from 'jsonwebtoken';

// const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    if(decoded.id===1){
      return NextResponse.json({ error: 'Admin cannot have a session' }, { status: 401 });
    }
    // Start new session
    const session = await prisma.sessions.create({
      data: {
        user_id: decoded.id,
      },
    });

    return NextResponse.json(session);
  } catch (error:any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { sessionId } = await req.json();
    
    // Update lastActive time or end session
    const session = await prisma.sessions.update({
      where: { id: sessionId },
      data: { lastActive: new Date() },
    });

    return NextResponse.json(session);
  } catch (error:any) {
    return NextResponse.json({ error:error?.message || 'Server error' }, { status: 500 });
  }
} 