import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const adminLogin = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(404, "Email and password is required");
  }
  if (email !== "admin@admin.com") {
    throw new ApiError(400, "email not found");
  }
  if (password !== "admin") {
    throw new ApiError(400, "wrong password");
  }
  const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
    expiresIn: 86400000,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { token, email, password },
        "Admin logged in successfully"
      )
    );
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Unauthorized! Please login again");
  }
  const { email, password } = jwt.verify(token, process.env.JWT_SECRET);
  if (email !== "admin@admin.com" || password !== "admin") {
    throw new ApiError(401, "Unauthorized! Please login again");
  }
  next();
});

export { adminLogin, isAdmin };
