import express from "express";
import upload from "../config/upload.js";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../auth/authMiddleware.js";
import { requireAdmin } from "../auth/requireAdmin.js";

const router = express.Router();

/*
  GET /api/media
  Public route
  Get all media
*/
router.get("/", async (req, res) => {
    try {
        const media = await db.orm.public.Media
            .where({})
            .all();

        res.json({
            success: true,
            media,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch media",
        });
    }
});


router.post(
    "/upload",
    authenticateToken,
    requireAdmin,
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "File is required",
                });
            }

            const fileUrl = `/uploads/${req.file.filename}`;

            const media = await db.orm.public.Media.create({
                filename: req.file.originalname,
                url: fileUrl,
                type: req.file.mimetype,
                size: req.file.size,
            });

            res.status(201).json({
                success: true,
                message: "File uploaded successfully",
                media,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to upload file",
            });
        }
    }
);

/*
  GET /api/media/:id
  Public route
  Get one media item by ID
*/
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid media ID",
            });
        }

        const media = await db.orm.public.Media
            .where({ id })
            .first();

        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Media not found",
            });
        }

        res.json({
            success: true,
            media,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch media",
        });
    }
});

/*
  POST /api/media
  Admin only
  Create a media record
*/
router.post(
    "/",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                filename,
                url,
                type,
                size,
            } = req.body;

            if (!filename || !url) {
                return res.status(400).json({
                    success: false,
                    message: "Filename and URL are required",
                });
            }

            if (
                size !== undefined &&
                size !== null &&
                (!Number.isInteger(size) || size < 0)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Size must be a non-negative integer",
                });
            }

            const media = await db.orm.public.Media.create({
                filename,
                url,
                type: type || null,
                size: size ?? null,
            });

            res.status(201).json({
                success: true,
                message: "Media created successfully",
                media,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to create media",
            });
        }
    }
);

/*
  PUT /api/media/:id
  Admin only
  Update a media record
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
                    message: "Invalid media ID",
                });
            }

            const existingMedia = await db.orm.public.Media
                .where({ id })
                .first();

            if (!existingMedia) {
                return res.status(404).json({
                    success: false,
                    message: "Media not found",
                });
            }

            const {
                filename,
                url,
                type,
                size,
            } = req.body;

            if (!filename || !url) {
                return res.status(400).json({
                    success: false,
                    message: "Filename and URL are required",
                });
            }

            if (
                size !== undefined &&
                size !== null &&
                (!Number.isInteger(size) || size < 0)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Size must be a non-negative integer",
                });
            }

            const media = await db.orm.public.Media
                .where({ id })
                .update({
                    filename,
                    url,
                    type: type || null,
                    size: size ?? null,
                });

            res.json({
                success: true,
                message: "Media updated successfully",
                media,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to update media",
            });
        }
    }
);

/*
  DELETE /api/media/:id
  Admin only
  Delete a media record
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
                    message: "Invalid media ID",
                });
            }

            const existingMedia = await db.orm.public.Media
                .where({ id })
                .first();

            if (!existingMedia) {
                return res.status(404).json({
                    success: false,
                    message: "Media not found",
                });
            }

            const deletedMedia = await db.orm.public.Media
                .where({ id })
                .delete();

            res.json({
                success: true,
                message: "Media deleted successfully",
                media: deletedMedia,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to delete media",
            });
        }
    }
);

export default router;