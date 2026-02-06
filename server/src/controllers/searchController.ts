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
    res.json({ tasks, projects, users });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
