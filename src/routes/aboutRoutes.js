import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../auth/authMiddleware.js";
import { requireAdmin } from "../auth/requireAdmin.js";

const router = express.Router();

// Get all About information
router.get("/", async (req, res) => {
    try {
        const about = await db.orm.public.About
            .where({})
            .all();

        res.json({
            success: true,
            about,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch About information",
        });
    }
});

// Create About information
router.post(
    "/",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { title, description, imageUrl } = req.body;

            if (!title || !description) {
                return res.status(400).json({
                    success: false,
                    message: "Title and description are required",
                });
            }

            const about = await db.orm.public.About.create({
                title,
                description,
                imageUrl: imageUrl || null,
            });

            res.status(201).json({
                success: true,
                message: "About information created successfully",
                about,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to create About information",
            });
        }
    }
);

// Update About information
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
                    message: "Invalid About ID",
                });
            }

            const existingAbout = await db.orm.public.About
                .where({ id })
                .first();

            if (!existingAbout) {
                return res.status(404).json({
                    success: false,
                    message: "About information not found",
                });
            }

            const { title, description, imageUrl } = req.body;

            if (!title || !description) {
                return res.status(400).json({
                    success: false,
                    message: "Title and description are required",
                });
            }

            const about = await db.orm.public.About
                .where({ id })
                .update({
                    title,
                    description,
                    imageUrl: imageUrl || null,
                });

            res.json({
                success: true,
                message: "About information updated successfully",
                about,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to update About information",
            });
        }
    }
);

export default router;