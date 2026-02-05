import { Router } from "express";
import { search } from "../controllers/searchController.ts";

const router = Router();

router.get("/", search);

export default router;
