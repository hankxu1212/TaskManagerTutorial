import { Router } from "express";
import { createAttachment, deleteAttachment } from "../controllers/attachmentController.ts";

const router = Router();

router.post("/", createAttachment);
router.delete("/:attachmentId", deleteAttachment);

export default router;
