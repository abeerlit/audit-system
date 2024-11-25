import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../config/prisma';

export const dynamic = 'force-dynamic';

async function getStatsComparison(filter: any, previousFilter: any) {
    const currentStats = await prisma.chapterItem.findMany({ where: filter });
    const previousStats = await prisma.chapterItem.findMany({ where: previousFilter });

    const current = {
        total: currentStats.length,
        accepted: currentStats.filter(item => item.itemAction === 'accept').length,
        edited: currentStats.filter(item => item.itemAction === 'edit').length,
        skipped: currentStats.filter(item => item.itemAction === 'skip').length,
        flagged: currentStats.filter(item => item.itemAction === 'flag').length,
    };

    const previous = {
        total: previousStats.length,
        accepted: previousStats.filter(item => item.itemAction === 'accept').length,
        edited: previousStats.filter(item => item.itemAction === 'edit').length,
        skipped: previousStats.filter(item => item.itemAction === 'skip').length,
        flagged: previousStats.filter(item => item.itemAction === 'flag').length,
    };

    const calculatePercentage = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    return {
        current,
        percentages: {
            total: calculatePercentage(current.total, previous.total),
            accepted: calculatePercentage(current.accepted, previous.accepted),
            edited: calculatePercentage(current.edited, previous.edited),
            skipped: calculatePercentage(current.skipped, previous.skipped),
            flagged: calculatePercentage(current.flagged, previous.flagged),
        }
    };
}

export async function GET(req: NextRequest) {
    try {
        const chapterId = req.nextUrl.searchParams.get('chapter_id');
        const userId = req.nextUrl.searchParams.get('user_id');
        const userType = req.nextUrl.searchParams.get('user_type');
        const timePeriod = req.nextUrl.searchParams.get('time_period');
console.log(chapterId,"chapterId",userId,"userId",userType,"userType",timePeriod,"timePeriod");

        // Build date filter based on time period
        let dateFilter = {};
        const now = new Date();
        const startDate = new Date();
        if (timePeriod) {
            switch (timePeriod.toLowerCase()) {
                case 'today':
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'all time':
                    startDate.setFullYear(now.getFullYear() - 4);
                    break;
                default:
                    break;
            }
            dateFilter = {
                created_timestamp: {
                    gte: startDate,
                    lte: now
                }
            };
        }

        // Build where clause based on filters
        let whereClause: any = {
            ...dateFilter
        };

        // Add chapter filter if provided
        if (chapterId) {
            whereClause.chapter_id = parseInt(chapterId, 10);
        }

        // Add user filter if provided
        if (userId) {
            whereClause.broker_id = parseInt(userId, 10);
        }
        if (userType) {
            whereClause = {
                ...whereClause,
                brokerName: {
                    role: userType
                }
            };
        }

        // Create current period filter
        const currentFilter = { ...whereClause };
        
        // Create previous period filter
        const previousFilter = { ...whereClause };
        const previousStart = new Date();
        const previousEnd = new Date(startDate); // startDate from your existing dateFilter

        switch (timePeriod?.toLowerCase()) {
            case 'today':
                previousStart.setDate(now.getDate() - 1);
                previousStart.setHours(0, 0, 0, 0);
                previousEnd.setDate(now.getDate() - 1);
                previousEnd.setHours(23, 59, 59, 999);
                break;
            case 'week':
                previousStart.setDate(now.getDate() - 14);
                previousEnd.setDate(now.getDate() - 7);
                break;
            case 'month':
                previousStart.setMonth(now.getMonth() - 2);
                previousEnd.setMonth(now.getMonth() - 1);
                break;
            case 'all time' :
                previousStart.setFullYear(now.getFullYear() - 4);
                previousEnd.setFullYear(now.getFullYear());
                break;
            default:
                previousStart.setDate(now.getDate() - 1);
                previousEnd.setHours(0, 0, 0, 0);
        }

        previousFilter.created_timestamp = {
            gte: previousStart,
            lte: previousEnd
        };

        const { current, percentages } = await getStatsComparison(currentFilter, previousFilter);
        const chapters = await prisma.chapters.findMany();

        const chaptersDetails = {
            totalChapters: chapters.length,
            chapterIncreasePercentage: percentages.total,
            totalItems: current.total,
            acceptedItems: current.accepted,
            acceptedIncreasePercentage: percentages.accepted,
            editedItems: current.edited,
            editedIncreasePercentage: percentages.edited,
            skippedItems: current.skipped,
            skippedIncreasePercentage: percentages.skipped,
            flaggedItems: current.flagged,
            flaggedIncreasePercentage: percentages.flagged,
            auditTimeAvg: 0,
            dailyWorkingHours: 0
        };

        return NextResponse.json({ chaptersDetails, chapterItems: current, error: false, status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: true, message: 'Error fetching chapters.' },
            { status: 500 }
        );
    }
}
