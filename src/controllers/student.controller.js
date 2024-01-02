import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Student } from "../models/student.model.js";
import jwt from "jsonwebtoken";

const addStudent = asyncHandler(async (req, res) => {
  const { fullName, email, department, password } = req.body;
  if (
    [fullName, email, department, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(404, "all fields are required");
  }

  const existedStudent = await Student.findOne({ email });

  if (existedStudent) {
    throw new ApiError(409, "Student with email already exist");
  }

  const student = await Student.create({
    fullName,
    email: email.toLowerCase(),
    department: department || "",
    password,
  });
  const createdStudent = await Student.findById(student._id).select(
    "-password"
  );
  if (!createdStudent) {
    throw new ApiError(
      500,
      "Something went wrong while registering the student"
    );
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdStudent, "student registered successfully")
    );
});

const studentLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(404, "email and password is required");
  }
  const student = await Student.findOne({ email });
  if (!student) {
    throw new ApiError(404, "Student does not exist");
  }
  const checkPassword = await student.isPasswordCorrect(password);
  if (!checkPassword) {
    throw new ApiError(400, "Wrong password");
  }
  const token = jwt.sign({ _id: student._id, email }, process.env.JWT_SECRET, {
    expiresIn: 86400000,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        fullName: student.fullName,
        email: student.email,
        department: student.department,
      },
      "logged in successfully"
    )
  );
});

const getStudentById = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    throw new ApiError(404, "student id not found");
  }
  const student = await Student.findById(_id).select("-password");
  if (!student) {
    throw new ApiError(404, "student does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, student, "student fetched successfully"));
});

const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({}).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, students, "Fetched all students"));
});

export { addStudent, studentLogin, getStudentById, getAllStudents };
