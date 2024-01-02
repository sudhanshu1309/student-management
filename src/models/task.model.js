import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    detail: {
      type: String,
      trim: true,
    },
    deadline: {
      type: Date,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "OVERDUE"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
