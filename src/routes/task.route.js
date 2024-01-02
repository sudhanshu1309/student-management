import { Router } from "express";
import { changeStatus, createTask } from "../controllers/task.controller.js";
import { isAdmin } from "../controllers/auth.controller.js";

const router = Router();

router.route("/create-task").post(createTask);
router.route("/change-status").patch(changeStatus);

export default router;
