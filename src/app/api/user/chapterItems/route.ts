import { NextResponse } from 'next/server';
import prisma from '../../../../../config/prisma'; // Adjust the path based on your prisma config
import { NextRequest } from 'next/server';
// GET: Fetch chapterItems based on broker_id
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId: any = req.nextUrl.searchParams.get('user_id');
  try {
    console.log(params, 'user id', userId);
    const userIdParsed = parseInt(userId, 10);

    // Check if brokerId is a valid number
    if (isNaN(userIdParsed)) {
      return NextResponse.json(
        { error: true, message: 'Invalid user ID.' },
        { status: 400 }
      );
    }

    // Fetch chapterItems where user_id matches the provided userId
    const chapterItems = await prisma.chapterItems.findMany({
      where: {
        user_id: userIdParsed,
      },
      include: {
        chapter: true, // Include related sections if needed
      },
    });

    // Return the chapterItems in the response
    return NextResponse.json({ chapterItems, error: false, status: 200 });
  } catch (error: any) {
    console.error('Error fetching chapterItems:', error);
    return NextResponse.json(
      { error: true, message: error.message || 'Error fetching chapter items.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const itemId: any = req.nextUrl.searchParams.get('itemId');
  const { action } = await req.json();

  try {
    const itemIdParsed = parseInt(itemId, 10);

    if (isNaN(itemIdParsed)) {
      return NextResponse.json(
        { error: true, message: 'Invalid item ID.' },
        { status: 400 }
      );
    }
    if (!['new', 'accept', 'skip', 'edit', 'flag'].includes(action)) {
      return NextResponse.json(
        { error: true, message: 'Invalid action.' },
        { status: 400 }
      );
    }

    const chapterItem = await prisma.chapterItems.findUnique({
      where: { id: itemIdParsed },
    });
    if (!chapterItem) {
      return NextResponse.json(
        { error: true, message: 'No chapter items found for this broker.' },
        { status: 404 }
      );
    }

    const updatedItem = await prisma.chapterItems.update({
      where: { id: itemIdParsed },
      data: { status: action },
    });

    return NextResponse.json(
      { updatedItem, error: false, message: 'Item updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating chapterItems:', error);
    return NextResponse.json(
      { error: true, message: error.message || 'Error updating chapter items.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const itemId: any = req.nextUrl.searchParams.get('itemId');
  const itemIdParsed = parseInt(itemId, 10);
  const { expert_hs_code, broker_hs_code } = await req.json();


  const chapterItem = await prisma.chapterItems.findUnique({
    where: { id: itemIdParsed },
  });
  if (!chapterItem) {
    return NextResponse.json(
      { error: true, message: 'No chapter items found for this broker.' },
      { status: 404 }
    );
  }
  let data = {}
  if (expert_hs_code && expert_hs_code != null) {
    data = { expert_hs_code: +expert_hs_code }
  } else if (broker_hs_code && broker_hs_code != null) {
    data = { broker_hs_code: +broker_hs_code }
  }
  const updatedItem = await prisma.chapterItems.update({
    where: { id: itemIdParsed },
    data: data,
  });
  return NextResponse.json(
    { updatedItem, error: false, message: 'Code updated successfully' },
    { status: 200 }
  );
}
