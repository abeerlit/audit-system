import { NextResponse } from 'next/server';
import prisma from '../../../../../config/prisma'; // Adjust the path to your prisma config

export const dynamic = 'force-dynamic'; // New way to disable static optimization in Next.js App Router

export async function GET() {
  try {
    const chapters = await prisma.chapterNames.findMany();
    return NextResponse.json({ chapters, error: false, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: 'Error fetching chapters.' },
      { status: 500 }
    );
  }
}
