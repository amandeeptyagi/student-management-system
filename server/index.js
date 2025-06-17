import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import lectureRoutes from "./routes/lectureRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import { corsMiddleware } from "./middlewares/corsMiddleware.js";


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
// app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(corsMiddleware);
// app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/lecture", lectureRoutes);
app.use("/api/course", courseRoutes);

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));