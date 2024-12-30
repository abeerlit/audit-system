import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '../../../../../config/prisma'; // Adjust the path to your prisma config

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Get `broker_id` from query parameters
    const userId = req.nextUrl.searchParams.get('user_id');
    const chapterId = req.nextUrl.searchParams.get('chapter_id');
    const userIdParsed: any = userId ? parseInt(userId, 10) : undefined;
    const chapterIdParsed: any = chapterId ? parseInt(chapterId, 10) : undefined;
    console.log("chapterIdParsed", chapterIdParsed, userIdParsed, "userIdParsed", chapterId, "chapterId");
    // Check if `broker_id` is a valid integer
    if (userId && isNaN(userIdParsed)) {
      return NextResponse.json(
        { error: true, message: 'Invalid user_id format.' },
        { status: 400 }
      );
    }

    let whereCondition = {};
    if (userIdParsed) {
      whereCondition = { ...whereCondition, user_id: userIdParsed };
    }
    if (chapterIdParsed) {
      whereCondition = { ...whereCondition, chapterNames_id: chapterIdParsed };
    }
    // Fetch chapters based on the presence of `broker_id`
    const chapterItems = await prisma.chapterItems.findMany({
      where: whereCondition,
      // include: {
      //   chapterItems:true,
      // },
    });

    return NextResponse.json({ chapterItems, error: false, status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: error.message || 'Error fetching chapter items.' },
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
    const expertId = parseInt(formData.get('expertId') as string, 10); // Ensure brokerId is an integer
    let chapterNameArray: any = [];
    if (expertId) {
      chapterNameArray = chapterName.split('|');
    }

    let chapter_name: any = [];
    if (expertId) {
      await Promise.all(chapterNameArray.map(async (chapter: any) => {
        // Step 3: Look up the chapter_id based on the chapterName
        let chapterFound = await prisma.chapters.findFirst({
          where: { chapter_name: chapter },
        });
        console.log("chapter_name", chapter_name);
        if (!chapter_name) {
          throw new Error('Chapter not found');
        }
        chapter_name.push(chapterFound);
      }))
    } else {
      let chapterFound = await prisma.chapters.findFirst({
        where: { chapter_name: chapterName },
      });
      if (!chapterFound) {
        throw new Error('Chapter not found');
      }
      chapter_name.push(chapterFound);
    }
    // Step 4: Read the XLSX file from the uploaded file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' }); // Read the file as an array buffer
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Add this validation after reading the worksheet
    const requiredFields = ['item_name', 'chapter_id', 'item_link', 'item_image', 'item_price', 'item_weight', 'original_hs_code'];

    // Validate first row (headers)
    const firstRow: any = worksheet[0];
    const missingFields = requiredFields.filter(field => !(field in firstRow));
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: true,
        message: `Required fields missing in file: ${missingFields.join(', ')}`,
      }, { status: 400 });
    }

    if (worksheet.length > 0 && brokerId && worksheet.filter((item: any) => item.chapter_id === chapter_name[0].id).length === 0) {
      return NextResponse.json({
        error: true,
        message: 'No chapterId found in the file for the selected chapter.',
      }, { status: 400 });
    }

    else if (expertId && worksheet.filter((item: any) =>
      chapter_name.some((chapter: any) => chapter.id === item.chapter_id)
    ).length === 0) {
      return NextResponse.json({
        error: true,
        message: 'No chapterId found in the file for the selected chapter.',
      }, { status: 400 });
    }
    // Step 5: Create a new section and add associated chapter items
    const newChapterItems = await Promise.all(
      worksheet.filter((item: any) =>
        chapter_name.some((chapter: any) => chapter.id === item.chapter_id)
      )
        .map(async (item: any) => {
          return prisma.chapterItems.create({
            data: {
              item_name: item.item_name ?? '',
              chapter_id: item.chapter_id, // Ensure this is correctly set in the XLSX file
              item_link: item.item_link || null,
              item_image: item.item_image || null,
              item_price: item.item_price ? parseFloat(item.item_price) : null,
              item_weight: item.item_weight ? parseFloat(item.item_weight) : null,
              item_detail: item.item_detail || null,
              search_sentence: item.search_sentence || null,
              original_hs_code: item.original_hs_code ? parseInt(item.original_hs_code) : null,
              broker_hs_code: item.broker_hs_code ? parseInt(item.broker_hs_code) : null,
              expert_hs_code: item.expert_hs_code ? parseInt(item.expert_hs_code) : null,
              status: "new",
              expert_status: "new",
              user_id: brokerId || expertId, // Include the user_id
            },
          });
        })
    );

    // Step 6: Return the response with the created section and items
    return NextResponse.json({
      chapterItems: newChapterItems,
      error: false,
      status: 201,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || 'Failed to process the XLSX file or create the section.',
      },
      { status: 500 }
    );
  }
}
