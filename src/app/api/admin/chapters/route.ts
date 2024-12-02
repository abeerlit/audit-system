import { NextResponse } from 'next/server';
import prisma from '../../../../../config/prisma'; // Adjust the path to your prisma config

export const dynamic = 'force-dynamic'; // New way to disable static optimization in Next.js App Router

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (userId) {

      // Fetch all chapters but only include chapterItems for the specific chapterIds
      const chapters = await prisma.chapters.findMany({
        include: {
          chapterItems: {
            where: {
              user_id: Number(userId)
            }
          }
        }
      });

      return NextResponse.json({ chapters, error: false, status: 200 });

    }

    else {
      const chapters = await prisma.chapters.findMany({ include: { chapterItems: true } });
      return NextResponse.json({ chapters, error: false, status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message || 'Error fetching chapters.' },
      { status: 500 }
    );
  }
}
