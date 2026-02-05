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

export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await getPrismaClient().project.findMany();
    res.json(projects);
  } catch (error: any) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ error: "Failed to fetch projects: " + error.message });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const project = await getPrismaClient().project.create({
      data: { name, description, startDate, endDate },
    });
    res.status(201).json(project);
  } catch (error: any) {
    console.error("Error creating project:", error.message);
    res.status(500).json({ error: "Failed to create project: " + error.message });
  }
};