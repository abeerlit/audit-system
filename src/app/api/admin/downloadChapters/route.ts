import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '../../../../../config/prisma';

export async function GET(req: NextRequest) {
  try {
    const chapterIds = req.nextUrl.searchParams.get('chapter_ids');
    console.log(chapterIds);
    const whereCondition: any = {
     
    };
    if(chapterIds){
      whereCondition.chapter_id = {
        in: chapterIds ? chapterIds.split(',').map(id => parseInt(id)) : []
      }
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
        user_id: true
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
        status: item.status || 'new', // Map status to itemAction
        expert_status: item.expert_status || 'new',
        user_id: item.user_id || ''
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