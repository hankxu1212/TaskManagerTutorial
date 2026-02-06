import { Router } from "express";
import { getTags, createTag, updateTag, deleteTag } from "../controllers/tagController.ts";

const router = Router();

router.get("/", getTags);
router.post("/", createTag);
router.patch("/:tagId", updateTag);
router.delete("/:tagId", deleteTag);

export default router;
