import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../config/prisma';

// GET: Fetch comments for a specific chapter item
export async function GET(req: NextRequest) {
  try {
    const chapter_item_id = req.nextUrl.searchParams.get('chapter_item_id');

    if (!chapter_item_id) {
      return NextResponse.json(
        { error: true, message: 'chapter_item_id is required' },
        { status: 400 }
      );
    }

    const chapterItemIdParsed = parseInt(chapter_item_id, 10);

    if (isNaN(chapterItemIdParsed)) {
      return NextResponse.json(
        { error: true, message: 'Invalid chapter_item_id format' },
        { status: 400 }
      );
    }

    const comments = await prisma.comments.findMany({
      where: { chapter_item_id: chapterItemIdParsed },
      include: {
        user: {
          select: {
            id: true,
            firstName: true, // Select only the username field
            lastName: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ comments, error: false }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching comments:', error);

    return NextResponse.json(
      { error: true, message: error.message || 'Error fetching comments.' },
      { status: 500 }
    );
  }
}

// POST: Add a new comment to a chapter item
export async function POST(req: NextRequest) {
  try {
    const { user_id, chapter_item_id, content } = await req.json();

    // Validate required fields
    if (!user_id || !chapter_item_id || !content) {
      return NextResponse.json(
        {
          error: true,
          message: 'user_id, chapter_item_id, and content are required',
        },
        { status: 400 }
      );
    }

    const comment = await prisma.comments.create({
      data: {
        user_id,
        chapter_item_id,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true, // Select only the username field
            lastName: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ comment, error: false, status: 200 });
  } catch (error: any) {
    console.error('Error adding comment:', error);

    return NextResponse.json(
      { error: true, message: error.message || 'Error adding comment.' },
      { status: 500 }
    );
  }
}
