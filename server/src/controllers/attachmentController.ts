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

export const createAttachment = async (req: Request, res: Response): Promise<void> => {
    const { taskId, uploadedById, fileName, fileExt } = req.body;

    if (!taskId || !uploadedById || !fileExt) {
        res.status(400).json({ error: "Missing required fields: taskId, uploadedById, fileExt" });
        return;
    }

    try {
        const attachment = await getPrismaClient().attachment.create({
            data: {
                taskId: Number(taskId),
                uploadedById: Number(uploadedById),
                fileName: fileName || null,
                fileExt,
            },
        });

        res.status(201).json(attachment);
    } catch (error: any) {
        console.error("Error creating attachment:", error.message);
        res.status(500).json({ error: `Error creating attachment: ${error.message}` });
    }
};

export const deleteAttachment = async (req: Request, res: Response): Promise<void> => {
    const { attachmentId } = req.params;

    try {
        // Check if attachment exists first
        const existing = await getPrismaClient().attachment.findUnique({
            where: { id: Number(attachmentId) },
        });

        if (!existing) {
            res.status(404).json({ error: "Attachment not found" });
            return;
        }

        await getPrismaClient().attachment.delete({
            where: { id: Number(attachmentId) },
        });

        res.json({ message: "Attachment deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting attachment:", error.message);
        res.status(500).json({ error: `Error deleting attachment: ${error.message}` });
    }
};
