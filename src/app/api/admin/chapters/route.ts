import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '../../../../../config/prisma'; // Adjust the path to your prisma config

export const dynamic = 'force-dynamic'; // New way to disable static optimization in Next.js App Router

// export const config = {
//   api: {
//     bodyParser: false, // Disable Next.js default body parsing
//   },
// };

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

    // Step 3: Read the XLSX file from the uploaded file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' }); // Read the file as an array buffer
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Step 4: Create the new chapter and associated chapter items
    const newChapter = await prisma.chapters.create({
      data: {
        chapter_name: chapterName,
        broker_id: brokerId, // Referencing the broker (user) via brokerId
        chapterItems: {
          create: worksheet.map(
            (item: any) => (
              console.log(item, 'xlsx item'),
              {
                item_name: item.item_name ?? 'Test',
                item_link: item.item_link,
                item_image: item.item_image,
                item_price: parseFloat(item.item_price),
                item_weight: parseFloat(item.item_weight),
                item_detail: item.item_detail,
                search_sentence: item.search_sentence,
                original_hs_code: parseInt(item.original_hs_code),
                broker_hs_code: item.broker_hs_code
                  ? parseInt(item.broker_hs_code)
                  : null,
                expert_hs_code: item.expert_hs_code
                  ? parseInt(item.expert_hs_code)
                  : null,
                status: item.status,
                expert_status: item.expert_status,
              }
            )
          ),
        },
      },
    });

    // Step 5: Return the response with the created chapter and items
    return NextResponse.json({
      chapter: newChapter,
      error: false,
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: true,
        message: 'Failed to process the XLSX file or create the chapter.',
      },
      { status: 500 }
    );
  }
}
