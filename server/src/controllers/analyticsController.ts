import type { Request, Response } from "express";
import { getPrismaClient } from "../lib/prisma.ts";

// Types for analytics
interface PointsDataPoint {
    date: string;      // ISO date string (start of period)
    points: number;    // Total points for the period
    label: string;     // Display label
}

type GroupBy = "week" | "month" | "year";

interface PointsAnalyticsQuery {
    userId?: string;
    groupBy?: string;
    startDate?: string;
    endDate?: string;
}

// Status constants
const STATUS_DONE = 3;

// Helper to get start of week (Monday)
function startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    d.setUTCDate(diff);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

// Helper to get start of month
function startOfMonth(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

// Helper to get start of year
function startOfYear(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
}

// Helper to format week label
function getWeekLabel(date: Date): string {
    const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    const day = date.getUTCDate();
    return `${month} ${day}`;
}

// Helper to format month label
function getMonthLabel(date: Date): string {
    return date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
}

// Helper to format year label
function getYearLabel(date: Date): string {
    return date.getUTCFullYear().toString();
}

// Generate periods between start and end dates based on groupBy
function generatePeriods(
    startDate: Date,
    endDate: Date,
    groupBy: GroupBy
): { start: Date; end: Date; label: string }[] {
    const periods: { start: Date; end: Date; label: string }[] = [];
    let current: Date;
    
    switch (groupBy) {
        case "week": {
            current = startOfWeek(startDate);
            while (current < endDate) {
                const periodEnd = new Date(current);
                periodEnd.setUTCDate(periodEnd.getUTCDate() + 7);
                periods.push({
                    start: new Date(current),
                    end: periodEnd,
                    label: getWeekLabel(current),
                });
                current = periodEnd;
            }
            break;
        }
        case "month": {
            current = startOfMonth(startDate);
            while (current < endDate) {
                const periodEnd = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 1));
                periods.push({
                    start: new Date(current),
                    end: periodEnd,
                    label: getMonthLabel(current),
                });
                current = periodEnd;
            }
            break;
        }
        case "year": {
            current = startOfYear(startDate);
            while (current < endDate) {
                const periodEnd = new Date(Date.UTC(current.getUTCFullYear() + 1, 0, 1));
                periods.push({
                    start: new Date(current),
                    end: periodEnd,
                    label: getYearLabel(current),
                });
                current = periodEnd;
            }
            break;
        }
    }
    
    return periods;
}

/**
 * Get points analytics for a user
 * GET /analytics/points?userId=:userId&groupBy=:groupBy&startDate=:startDate&endDate=:endDate
 *
 * Query Parameters:
 * - userId (required): The user ID to get analytics for
 * - groupBy (required): Grouping - "week", "month", or "year"
 * - startDate (required): Start of date range (ISO string)
 * - endDate (required): End of date range (ISO string)
 * 
 * Response:
 * - Array of PointsDataPoint objects with date, points, and label
 */
export const getPointsAnalytics = async (
    req: Request<{}, {}, {}, PointsAnalyticsQuery>,
    res: Response<PointsDataPoint[] | { error: string }>
): Promise<void> => {
    const { userId, groupBy, startDate, endDate } = req.query;

    // Validate userId
    if (!userId || isNaN(Number(userId))) {
        res.status(400).json({ error: "Valid userId is required" });
        return;
    }

    // Validate groupBy
    const validGroupBy: GroupBy[] = ["week", "month", "year"];
    if (!groupBy || !validGroupBy.includes(groupBy as GroupBy)) {
        res.status(400).json({ 
            error: "Invalid groupBy. Must be: week, month, or year" 
        });
        return;
    }

    // Validate dates
    if (!startDate || !endDate) {
        res.status(400).json({ error: "startDate and endDate are required" });
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({ error: "Invalid date format" });
        return;
    }

    if (start >= end) {
        res.status(400).json({ error: "startDate must be before endDate" });
        return;
    }

    const numericUserId = Number(userId);
    const groupByType = groupBy as GroupBy;

    try {
        const prisma = getPrismaClient();

        // Generate time periods
        const periods = generatePeriods(start, end, groupByType);

        // Query tasks where:
        // 1. status = 3 (Done)
        // 2. The task is assigned to the specified user
        // 3. dueDate is within the date range
        // 4. Task has points
        const tasks = await prisma.task.findMany({
            where: {
                status: STATUS_DONE,
                points: { not: null },
                dueDate: {
                    gte: start,
                    lt: end,
                },
                taskAssignments: {
                    some: {
                        userId: numericUserId,
                    },
                },
            },
            select: {
                id: true,
                points: true,
                dueDate: true,
            },
        });

        // Aggregate points by period
        const result: PointsDataPoint[] = periods.map((periodInfo) => {
            const periodPoints = tasks
                .filter((task) => {
                    if (!task.dueDate) return false;
                    const taskDate = new Date(task.dueDate);
                    return taskDate >= periodInfo.start && taskDate < periodInfo.end;
                })
                .reduce((sum, task) => sum + (task.points ?? 0), 0);

            return {
                date: periodInfo.start.toISOString(),
                points: periodPoints,
                label: periodInfo.label,
            };
        });

        res.json(result);
    } catch (error: any) {
        console.error("Analytics error:", error);
        res.status(500).json({ error: "Failed to fetch analytics data" });
    }
};
