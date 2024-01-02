import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(cookieParser());

// routes import
import studentRouter from "./routes/student.route.js";
import taskRouter from "./routes/task.route.js";
import authRouter from "./routes/auth.route.js";

// routes declaration
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/auth", authRouter);

export { app };
