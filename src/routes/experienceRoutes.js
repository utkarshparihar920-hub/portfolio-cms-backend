import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../auth/authMiddleware.js";
import { requireAdmin } from "../auth/requireAdmin.js";

const router = express.Router();

/*
  GET /api/experience
  Public route
  Get all experience records
*/
router.get("/", async (req, res) => {
    try {
        const experiences = await db.orm.public.Experience
            .where({})
            .all();

        res.json({
            success: true,
            experiences,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch experience",
        });
    }
});

/*
  GET /api/experience/:id
  Public route
  Get one experience record
*/
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID",
            });
        }

        const experience = await db.orm.public.Experience
            .where({ id })
            .first();

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }

        res.json({
            success: true,
            experience,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch experience",
        });
    }
});

/*
  POST /api/experience
  Admin only
  Create an experience record
*/
router.post(
    "/",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                company,
                position,
                description,
                startDate,
                endDate,
                current,
            } = req.body;

            if (!company || !position || !description || !startDate) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Company, position, description, and start date are required",
                });
            }

            if (
                current !== undefined &&
                typeof current !== "boolean"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Current must be a boolean",
                });
            }

            const experience = await db.orm.public.Experience.create({
                company,
                position,
                description,
                startDate,
                endDate: endDate || null,
                current: current ?? false,
            });

            res.status(201).json({
                success: true,
                message: "Experience created successfully",
                experience,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to create experience",
            });
        }
    }
);

/*
  PUT /api/experience/:id
  Admin only
  Update an experience record
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
                    message: "Invalid experience ID",
                });
            }

            const existingExperience =
                await db.orm.public.Experience
                    .where({ id })
                    .first();

            if (!existingExperience) {
                return res.status(404).json({
                    success: false,
                    message: "Experience not found",
                });
            }

            const {
                company,
                position,
                description,
                startDate,
                endDate,
                current,
            } = req.body;

            if (!company || !position || !description || !startDate) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Company, position, description, and start date are required",
                });
            }

            if (
                current !== undefined &&
                typeof current !== "boolean"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Current must be a boolean",
                });
            }

            const experience =
                await db.orm.public.Experience
                    .where({ id })
                    .update({
                        company,
                        position,
                        description,
                        startDate,
                        endDate: endDate || null,
                        current: current ?? false,
                    });

            res.json({
                success: true,
                message: "Experience updated successfully",
                experience,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to update experience",
            });
        }
    }
);

/*
  DELETE /api/experience/:id
  Admin only
  Delete an experience record
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
                    message: "Invalid experience ID",
                });
            }

            const existingExperience =
                await db.orm.public.Experience
                    .where({ id })
                    .first();

            if (!existingExperience) {
                return res.status(404).json({
                    success: false,
                    message: "Experience not found",
                });
            }

            const deletedExperience =
                await db.orm.public.Experience
                    .where({ id })
                    .delete();

            res.json({
                success: true,
                message: "Experience deleted successfully",
                experience: deletedExperience,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to delete experience",
            });
        }
    }
);

export default router;