import { Router } from "express";
import {
  addStudent,
  getStudentById,
  studentLogin,
  getAllStudents,
} from "../controllers/student.controller.js";

const router = Router();

router.route("/add-student").post(addStudent);
router.route("/student-login").post(studentLogin);
router.route("/student/:id").post(getStudentById);
router.route("/all-students").get(getAllStudents);

export default router;
