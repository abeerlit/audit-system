import { NextResponse } from 'next/server';
import prisma from '../../../../../config/prisma';
// import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'month';
    const user_id = searchParams.get('user_id') || "";
    const today = new Date();

    // Function to calculate total hours for a period
    const calculateTotalHours = (sessions: any[]) => {
      return sessions.reduce((total, session) => {
        const duration = session.lastActive
          ? (session.lastActive.getTime() - session.startTime.getTime()) / (1000 * 60 * 60)
          : 0;
        return total + Number(duration);
      }, 0);
    };

    let whereCondition={};
    if(user_id !== "1"){
      whereCondition={user_id:parseInt(user_id)}
    }
    // Get current period sessions
    const currentSessions = await prisma.sessions.findMany({
      where: {
        ...whereCondition,
        startTime: {
          gte: period === 'today'
            ? new Date(today.setHours(0, 0, 0, 0))
            : period === 'week'
            ? new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
            : period === 'month'
            ? new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
            : new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get previous period sessions
    const previousSessions = await prisma.sessions.findMany({
      where: {
        ...whereCondition,
        startTime: {
          gte: period === 'today'
            ? new Date(today.setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000)
            : period === 'week'
            ? new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
            : period === 'month'
            ? new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)
            : new Date(today.getTime() - 730 * 24 * 60 * 60 * 1000),
          lt: period === 'today'
            ? new Date(today.setHours(0, 0, 0, 0))
            : period === 'week'
            ? new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
            : period === 'month'
            ? new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
            : new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const currentTotalHours = calculateTotalHours(currentSessions);
    const previousTotalHours = calculateTotalHours(previousSessions);

    const calculatePercentage = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const percentageIncrease = calculatePercentage(currentTotalHours, previousTotalHours);

    let labels: string[] = [];
    let hours: number[] = [];

    if (period === 'today') {
      // Initialize labels for 4-hour intervals
      labels = ['0-4', '4-8', '8-12', '12-16', '16-20', '20-24'];
      hours = Array(labels.length).fill(0);

      currentSessions.forEach(session => {
        const startHour = session.startTime.getHours();
        const interval = Math.floor(startHour / 4);
        const duration = session.lastActive
          ? (session.lastActive.getTime() - session.startTime.getTime()) / (1000 * 60 * 60)
          : 0;

        hours[interval] += Number(duration);
      });
    } else if (period === 'month') {
      // Get last 5 weeks' dates
      const weeks = Array.from({ length: 5 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - ((4 - i) * 7));
        return `Week ${i + 1} (${date.toLocaleDateString()})`;
      });
      
      labels = weeks;
      hours = Array(labels.length).fill(0);

      currentSessions.forEach(session => {
        const weekIndex = 4 - Math.floor((today.getTime() - session.startTime.getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (weekIndex >= 0 && weekIndex < 5) {
          const duration = session.lastActive
            ? (session.lastActive.getTime() - session.startTime.getTime()) / (1000 * 60 * 60)
            : 0;
          hours[weekIndex] += Number(duration);
        }
      });
    } else if (period === 'week') {
      // Get last 7 days with day names
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { weekday: 'long' });
      });
      hours = Array(labels.length).fill(0);

      currentSessions.forEach(session => {
        const dayIndex = 6 - Math.floor((today.getTime() - session.startTime.getTime()) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0 && dayIndex < 7) {
          const duration = session.lastActive
            ? (session.lastActive.getTime() - session.startTime.getTime()) / (1000 * 60 * 60)
            : 0;
          hours[dayIndex] += Number(duration);
        }
      });
    } else {
      // Get last 12 months
      labels = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(today);
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleString('default', { month: 'long' });
      });
      hours = Array(labels.length).fill(0);

      currentSessions.forEach(session => {
        const monthIndex = 11 - Math.floor((today.getTime() - session.startTime.getTime()) / (30 * 24 * 60 * 60 * 1000));
        if (monthIndex >= 0 && monthIndex < 12) {
          const duration = session.lastActive
            ? (session.lastActive.getTime() - session.startTime.getTime()) / (1000 * 60 * 60)
            : 0;
          hours[monthIndex] += Number(duration);
        }
      });
    }

    return NextResponse.json({
      labels,
      hours,
      totalHours: currentTotalHours,
      percentageIncrease: Math.round(percentageIncrease * 100) / 100, // Round to 2 decimal places
    });
  } catch (error:any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
} 