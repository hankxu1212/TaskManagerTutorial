import type { Request, Response } from "express";
import { PrismaClient } from '../../prisma/generated/prisma/client.js';
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

let prisma: PrismaClient;

function getPrismaClient() {
    if (!prisma) {
        const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
}

export const createComment = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { taskId, userId, text } = req.body;
    
    // Validate required fields
    if (!taskId || !userId || !text) {
        res.status(400).json({ error: `Missing required fields: taskId=${taskId}, userId=${userId}, text=${text ? 'provided' : 'missing'}` });
        return;
    }
    
    const numericUserId = Number(userId);
    const numericTaskId = Number(taskId);
    
    if (isNaN(numericUserId) || isNaN(numericTaskId)) {
        res.status(400).json({ error: `Invalid numeric values: taskId=${taskId}, userId=${userId}` });
        return;
    }
    
    try {
        // Verify user exists
        const user = await getPrismaClient().user.findUnique({
            where: { userId: numericUserId },
        });
        
        if (!user) {
            res.status(404).json({ error: `User with id ${numericUserId} not found` });
            return;
        }
        
        const newComment = await getPrismaClient().comment.create({
            data: {
                taskId: numericTaskId,
                userId: numericUserId,
                text,
            },
            include: {
                user: true,
            },
        });
        res.status(201).json(newComment);
    } catch (error: any) {
        res.status(500).json({ error: `Error creating comment: ${error.message}` });
    }
};
