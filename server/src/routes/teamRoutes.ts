import { Router } from "express";
import { getTeams } from "../controllers/teamController.ts";

const router = Router();

router.get("/", getTeams);
export default router;
