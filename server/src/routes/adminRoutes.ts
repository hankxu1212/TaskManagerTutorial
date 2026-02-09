import { Router } from "express";
import { adminUpdateUser } from "../controllers/adminController.ts";

const router = Router();

router.patch("/users/:userId", adminUpdateUser);

export default router;
