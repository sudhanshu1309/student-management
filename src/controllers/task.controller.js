import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, detail, deadline, assignedTo } = req.body;
  if (
    [title, detail, deadline, assignedTo].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(404, "all fields are required");
  }
  const task = await Task.create({
    title,
    detail: detail,
    deadline: deadline,
    assignedTo,
  });
  const createdTask = await Task.findById(task._id);
  if (!createdTask) {
    throw new ApiError(500, "something went wrong while creating the task");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdTask, "Task created successfully"));
});

const changeStatus = asyncHandler(async (req, res) => {
  const { taskId, status } = req.body;
  if (!taskId) {
    throw new ApiError(404, "task id not found");
  }
  if (!status) {
    throw new ApiError(404, "no status provided");
  }
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { status },
    { new: true }
  );
  if (!updatedTask) {
    throw new ApiError(404, "task not found or error in updating");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "task updated successfully"));
});

export { createTask, changeStatus };
