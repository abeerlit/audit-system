import { NextResponse } from 'next/server';
import prisma from '../../../../../config/prisma'; // Adjust the path based on your prisma config
import { NextRequest } from 'next/server';
// GET: Fetch chapterItems based on broker_id
export async function GET(
  req: NextRequest,
  { params }: { params: { brokerId: string } }
) {
  let broker_id: any = req.nextUrl.searchParams.get('brokerId');
  try {
    console.log(params, 'broker id', broker_id);
    const brokerIdParsed = parseInt(broker_id, 10);

    // Check if brokerId is a valid number
    if (isNaN(brokerIdParsed)) {
      return NextResponse.json(
        { error: true, message: 'Invalid broker ID.' },
        { status: 400 }
      );
    }

    // Fetch chapterItems where broker_id matches the provided brokerId
    const chapterItems = await prisma.chapterItem.findMany({
      where: {
        broker_id: brokerIdParsed,
      },
      include: {
        section: true, // Include related sections if needed
      },
    });

    // If no chapterItems found, return a 404 response
    if (!chapterItems || chapterItems.length === 0) {
      return NextResponse.json(
        { error: true, message: 'No chapter items found for this broker.' },
        { status: 404 }
      );
    }

    // Return the chapterItems in the response
    return NextResponse.json({ chapterItems, error: false, status: 200 });
  } catch (error) {
    console.error('Error fetching chapterItems:', error);
    return NextResponse.json(
      { error: true, message: 'Error fetching chapter items.' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
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

    const chapterItem = await prisma.chapterItem.findUnique({
      where: { id: itemIdParsed },
    });
    if (!chapterItem) {
      return NextResponse.json(
        { error: true, message: 'No chapter items found for this broker.' },
        { status: 404 }
      );
    }

    const updatedItem = await prisma.chapterItem.update({
      where: { id: itemIdParsed },
      data: { itemAction: action },
    });

    return NextResponse.json(
      { updatedItem, error: false, message: 'Item updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating chapterItems:', error);
    return NextResponse.json(
      { error: true, message: 'Error updating chapter items.' },
      { status: 500 }
    );
  }
}
