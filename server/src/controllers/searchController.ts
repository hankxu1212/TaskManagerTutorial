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

// Status mapping: 0=Input Queue, 1=Work In Progress, 2=Review, 3=Done
const statusIntToString = (status: number | null): string | null => {
    const statusMap: Record<number, string> = {
        0: "Input Queue",
        1: "Work In Progress",
        2: "Review",
        3: "Done",
    };
    return status !== null ? statusMap[status] || null : null;
};

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    const tasks = await getPrismaClient().task.findMany({
      where: {
        OR: [
          { title: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
        ],
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
        taskTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const projects = await getPrismaClient().project.findMany({
      where: {
        OR: [
          { name: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
        ],
      },
    });

    const users = await getPrismaClient().user.findMany({
      where: {
        OR: [{ username: { contains: query as string, mode: "insensitive" } }],
      },
    });

    const sprints = await getPrismaClient().sprint.findMany({
      where: {
        title: { contains: query as string, mode: "insensitive" },
      },
      include: {
        _count: {
          select: { sprintTasks: true },
        },
      },
    });
    
    // Map integer status to string for frontend
    const tasksWithStringStatus = tasks.map(task => ({
        ...task,
        status: statusIntToString(task.status),
    }));
    
    res.json({ tasks: tasksWithStringStatus, projects, users, sprints });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
