import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '../../../../../config/prisma';
export async function POST(req: NextRequest) {
  try {
    const chapterId = req.nextUrl.searchParams.get('chapter_id');
    const userId = req.nextUrl.searchParams.get('user_id');
    const body = await req.json(); // Parse the request body
    const statsData = body.statsData; // Extract statsData

    const whereCondition: any = {};
    if (chapterId && chapterId !== '0') {
      whereCondition.chapter_id = parseInt(chapterId);
    }
    if (userId && userId !== '0') {
      whereCondition.user_id = parseInt(userId);
    }

    const chapterItems = await prisma.chapterItems.findMany({
      where: whereCondition,
      select: {
        id: true,
        chapter_id: true,
        item_name: true,
        item_link: true,
        item_image: true,
        item_price: true,
        item_weight: true,
        item_detail: true,
        search_sentence: true,
        original_hs_code: true,
        broker_hs_code: true,
        expert_hs_code: true,
        broker_update_timestamp: true,
        expert_update_timestamp: true,
        status: true,
        expert_status: true,
        user_id: true,
      },
    });

    const mappedItems=[]
    // const mappedItems:any = chapterItems.map(item => ({
    //   id: item.id,
    //   chapter_id: item.chapter_id,
    //   item_name: item.item_name || '',
    //   item_link: item.item_link || '',
    //   item_image: item.item_image || '',
    //   item_price: item.item_price || '',
    //   item_weight: item.item_weight || '',
    //   item_detail: item.item_detail || '',
    //   search_sentence: item.search_sentence || '',
    //   original_hs_code: item.original_hs_code || '',
    //   broker_hs_code: item.broker_hs_code || '',
    //   expert_hs_code: item.expert_hs_code || '',
    //   status: item.status || 'new',
    //   expert_status: item.expert_status || 'new',
    //   user_id: item.user_id || '',
    // }));

    // Append statsData as a summary row
    const summaryRow = {
      totalItems: statsData.totalItems || 0,
      chapterIncreasePercentage: statsData.chapterIncreasePercentage || 0,
      acceptedItems: statsData.acceptedItems || 0,
      acceptedIncreasePercentage: statsData.acceptedIncreasePercentage || 0,
      editedItems: statsData.editedItems || 0,
      editedIncreasePercentage: statsData.editedIncreasePercentage || 0,
      skippedItems: statsData.skippedItems || 0,
      skippedIncreasePercentage: statsData.skippedIncreasePercentage || 0,
      flaggedItems: statsData.flaggedItems || 0,
      flaggedIncreasePercentage: statsData.flaggedIncreasePercentage || 0,
      auditTimeAvg: statsData.auditTimeAvg || 0,
      workingHoursAvg: statsData.workingHoursAvg || 0,
    };

    mappedItems.unshift(summaryRow); // Add summary row to the data

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(mappedItems);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ChapterItems');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create response with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="chapter_items.xlsx"',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: true, message: 'Error exporting data' }, { status: 500 });
  }
}
