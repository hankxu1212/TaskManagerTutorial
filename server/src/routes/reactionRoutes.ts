import { Router } from "express";
import { toggleReaction, getReactionsByComment } from "../controllers/reactionController.ts";

const router = Router();

router.post("/toggle", toggleReaction);
router.get("/comment/:commentId", getReactionsByComment);

export default router;
