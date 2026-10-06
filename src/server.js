import express from "express";
import cors from "cors";
import path from "path";
import { db } from "./prisma/db.ts";
import { loginUser } from "./auth/auth.js";
import { authenticateToken } from "./auth/authMiddleware.js";
import { requireAdmin } from "./auth/requireAdmin.js";
import userRoutes from "./routes/userRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: "https://portfolio-frontend-chi-lime.vercel.app",
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/users", userRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio CMS Backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio CMS API is healthy",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const users = await db.orm.public.User
      .where({})
      .all();

    res.json({
      success: true,
      message: "Database connection is working",
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

app.get(
  "/api/auth/protected",
  authenticateToken,
  (req, res) => {
    res.json({
      success: true,
      message: "Protected route accessed successfully",
      user: req.user,
    });
  }
);

app.get(
  "/api/admin/test",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: "Admin access granted",
      user: req.user,
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});