import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '../../../../../config/prisma';

export async function GET(req: NextRequest) {
  try {
    const chapterId = req.nextUrl.searchParams.get('chapter_id');
    const userId = req.nextUrl.searchParams.get('user_id');
    // const userType = req.nextUrl.searchParams.get('user_type');

    const whereCondition: any = {};
    
    if (chapterId && chapterId !== '0') {
      whereCondition.chapter_id = parseInt(chapterId);
    }
    
    if (userId && userId !== '0') {
      whereCondition.broker_id = parseInt(userId);
    }

    const chapterItems = await prisma.chapterItem.findMany({
      where: whereCondition,
      select: {
        id: true,
        chapter_id: true,
        item_name: true,
        itemAction: true,
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
        broker_id: true
      }
    });

    const mappedItems = chapterItems.map(item => ({
        id: item.id,
        chapter_id: item.chapter_id,
        item_name: item.item_name || '',
        item_link: item.item_link || '',
        item_image: item.item_image || '',
        item_price: item.item_price || '',
        item_weight: item.item_weight || '',
        item_detail: item.item_detail || '',
        search_sentence: item.search_sentence || '',
        original_hs_code: item.original_hs_code || '',
        broker_hs_code: item.broker_hs_code || '',
        expert_hs_code: item.expert_hs_code || '',
        status: item.itemAction || 'new', // Map status to itemAction
        expert_status: item.expert_status || '',
        broker_id: item.broker_id || ''
      }));
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
        'Content-Disposition': 'attachment; filename="chapter_items.xlsx"'
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: true, message: 'Error exporting data' }, { status: 500 });
  }
} 