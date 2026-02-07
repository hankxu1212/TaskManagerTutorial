import { Router } from "express";

import { getUser, getUserById, getUsers, postUser } from "../controllers/userController.ts";

const router = Router();

router.get("/", getUsers);
router.post("/", postUser);
router.get("/id/:userId", getUserById);
router.get("/:cognitoId", getUser);

export default router;
