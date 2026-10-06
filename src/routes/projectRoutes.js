import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../auth/authMiddleware.js";
import { requireAdmin } from "../auth/requireAdmin.js";

const router = express.Router();

/*
  GET /api/projects
  Public route
  Get all projects
*/
router.get("/", async (req, res) => {
    try {
        const projects = await db.orm.public.Project
            .where({})
            .all();

        res.json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
});

/*
  GET /api/projects/:id
  Public route
  Get one project
*/
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        const project = await db.orm.public.Project
            .where({ id })
            .first();

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.json({
            success: true,
            project,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch project",
        });
    }
});

/*
  POST /api/projects
  Admin only
  Create a project
*/
router.post(
    "/",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                title,
                description,
                imageUrl,
                liveUrl,
                githubUrl,
                technologies,
                featured,
            } = req.body;

            if (!title || !description) {
                return res.status(400).json({
                    success: false,
                    message: "Title and description are required",
                });
            }

            if (
                featured !== undefined &&
                typeof featured !== "boolean"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Featured must be a boolean",
                });
            }

            const project = await db.orm.public.Project.create({
                title,
                description,
                imageUrl: imageUrl || null,
                liveUrl: liveUrl || null,
                githubUrl: githubUrl || null,
                technologies: technologies || null,
                featured: featured ?? false,
            });

            res.status(201).json({
                success: true,
                message: "Project created successfully",
                project,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to create project",
            });
        }
    }
);

/*
  PUT /api/projects/:id
  Admin only
  Update a project
*/
router.put(
    "/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid project ID",
                });
            }

            const existingProject = await db.orm.public.Project
                .where({ id })
                .first();

            if (!existingProject) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found",
                });
            }

            const {
                title,
                description,
                imageUrl,
                liveUrl,
                githubUrl,
                technologies,
                featured,
            } = req.body;

            if (!title || !description) {
                return res.status(400).json({
                    success: false,
                    message: "Title and description are required",
                });
            }

            if (
                featured !== undefined &&
                typeof featured !== "boolean"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Featured must be a boolean",
                });
            }

            const project = await db.orm.public.Project
                .where({ id })
                .update({
                    title,
                    description,
                    imageUrl: imageUrl || null,
                    liveUrl: liveUrl || null,
                    githubUrl: githubUrl || null,
                    technologies: technologies || null,
                    featured: featured ?? false,
                });

            res.json({
                success: true,
                message: "Project updated successfully",
                project,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to update project",
            });
        }
    }
);

/*
  DELETE /api/projects/:id
  Admin only
  Delete a project
*/
router.delete(
    "/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid project ID",
                });
            }

            const existingProject = await db.orm.public.Project
                .where({ id })
                .first();

            if (!existingProject) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found",
                });
            }

            const deletedProject = await db.orm.public.Project
                .where({ id })
                .delete();

            res.json({
                success: true,
                message: "Project deleted successfully",
                project: deletedProject,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to delete project",
            });
        }
    }
);

export default router;