import {Router} from "express";
import {getTasks, createTask, updateTaskStatus, updateTask, getUserTasks, deleteTask} from "../controllers/taskController.ts";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:taskId", deleteTask);
router.patch("/:taskId/status", updateTaskStatus);
router.patch("/:taskId", updateTask);
router.get("/user/:userId", getUserTasks);

export default router;