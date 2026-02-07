import { Router } from "express";
import { createComment } from "../controllers/commentController.ts";

const router = Router();

router.post("/", createComment);

export default router;
