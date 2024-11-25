import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '../../../../../config/prisma'; // Adjust the path to your prisma config

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Get `broker_id` from query parameters
    const brokerId = req.nextUrl.searchParams.get('broker_id');
    const chapterId = req.nextUrl.searchParams.get('chapter_id');   
    const brokerIdParsed: any = brokerId ? parseInt(brokerId, 10) : undefined;
    const chapterIdParsed: any = chapterId ? parseInt(chapterId, 10) : undefined;
    console.log("chapterIdParsed", chapterIdParsed, brokerIdParsed, "brokerIdParsed",chapterId,"chapterId");
    // Check if `broker_id` is a valid integer
    if (brokerId && isNaN(brokerIdParsed)) {
      return NextResponse.json(
        { error: true, message: 'Invalid broker_id format.' },
        { status: 400 }
      );
    }

    let whereCondition = {};
    if (brokerIdParsed) {
      whereCondition = { ...whereCondition, broker_id: brokerIdParsed };
    }
    if (chapterIdParsed) {
      whereCondition = { ...whereCondition, chapterNames_id: chapterIdParsed };
    }
    // Fetch chapters based on the presence of `broker_id`
    const chapters = await prisma.chapters.findMany({
      where: whereCondition,
      include: {
        brokerName: true, // Includes User model for brokerName
        chapterItems: true, // Includes associated ChapterItem records
      },
    });

    return NextResponse.json({ chapters, error: false, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: 'Error fetching chapters.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Step 1: Parse the form data using the built-in formData() method
    const formData = await request.formData();

    // Step 2: Extract the file and other form fields from formData
    const file = formData.get('file') as File; // Assuming the field name is 'file'
    const chapterName = formData.get('chapterName') as string;
    const brokerId = parseInt(formData.get('brokerId') as string, 10); // Ensure brokerId is an integer

    if (!file) {
      throw new Error('No file uploaded');
    }

    // Step 3: Look up the chapter_id based on the chapterName
    const chapter_name = await prisma.chapterNames.findFirst({
      where: { chapter_name: chapterName },
    });

    if (!chapter_name) {
      throw new Error('Chapter not found');
    }

    // Step 4: Read the XLSX file from the uploaded file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' }); // Read the file as an array buffer
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Step 5: Create a new section and add associated chapter items
    const newChapter = await prisma.chapters.create({
      data: {
        chapterNames_id: chapter_name.id, // Include the chapter_id from the Chapters model
        chapter_name: chapterName,
        broker_id: brokerId, // Referencing the broker (user) via brokerId
        chapterItems: {
          create: worksheet.map((item: any) => ({
            item_name: item.item_name ?? 'Test', // Default to 'Test' if item_name is missing
            // chapter_id: item.chapter_id, // Ensure this is correctly set in the XLSX file
            item_link: item.item_link || null, // Pass null instead of undefined
            item_image: item.item_image || null,
            item_price: item.item_price ? parseFloat(item.item_price) : null, // Ensure it’s either a float or null
            item_weight: item.item_weight ? parseFloat(item.item_weight) : null,
            item_detail: item.item_detail || null,
            search_sentence: item.search_sentence || null,
            original_hs_code: item.original_hs_code
              ? parseInt(item.original_hs_code)
              : null, // Handle null case
            broker_hs_code: item.broker_hs_code
              ? parseInt(item.broker_hs_code)
              : null,
            expert_hs_code: item.expert_hs_code
              ? parseInt(item.expert_hs_code)
              : null,
            status: item.status || null,
            expert_status: item.expert_status || null,
            broker_id: brokerId, // Include the broker_id
          })),
        },
      },
    });

    // Step 6: Return the response with the created section and items
    return NextResponse.json({
      section: newChapter,
      error: false,
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: true,
        message: 'Failed to process the XLSX file or create the section.',
      },
      { status: 500 }
    );
  }
}
