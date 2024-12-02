import { NextResponse } from 'next/server';
import prisma from '../../../../../config/prisma'; // Adjust the path to your prisma config

export const dynamic = 'force-dynamic'; // New way to disable static optimization in Next.js App Router

export async function GET() {
  try {
    const sections = await prisma.sections.findMany();
    return NextResponse.json({ sections, error: false, status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message || 'Error fetching sections.' },
      { status: 500 }
    );
  }
}
