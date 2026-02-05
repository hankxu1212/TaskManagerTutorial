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

export const getTeams = async (req: Request, res: Response): Promise<void> => {
    try {
        const teams = await getPrismaClient().team.findMany();

        const teamsWithUsernames = await Promise.all(
            teams.map(async (team: any) => {
                const productOwner = await getPrismaClient().user.findUnique({
                    where: { userId: team.productOwnerUserId! },
                    select: { username: true },
                });

                const projectManager = await getPrismaClient().user.findUnique({
                    where: { userId: team.projectManagerUserId! },
                    select: { username: true },
                });

                return {
                    ...team,
                    productOwnerUsername: productOwner?.username,
                    projectManagerUsername: projectManager?.username,
                };
            })
        );

        res.json(teamsWithUsernames);
    } catch (error: any) {
        res
            .status(500)
            .json({ message: `Error retrieving teams: ${error.message}` });
    }
};
