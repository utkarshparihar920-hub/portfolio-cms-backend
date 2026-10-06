import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../auth/authMiddleware.js";
import { requireAdmin } from "../auth/requireAdmin.js";

const router = express.Router();

/*
  GET /api/services
  Public route
  Get all services
*/
router.get("/", async (req, res) => {
    try {
        const services = await db.orm.public.Service
            .where({})
            .all();

        res.json({
            success: true,
            services,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch services",
        });
    }
});

/*
  GET /api/services/:id
  Public route
  Get one service
*/
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        const service = await db.orm.public.Service
            .where({ id })
            .first();

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        res.json({
            success: true,
            service,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch service",
        });
    }
});

/*
  POST /api/services
  Admin only
  Create a service
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
                iconUrl,
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

            const service = await db.orm.public.Service.create({
                title,
                description,
                iconUrl: iconUrl || null,
                featured: featured ?? false,
            });

            res.status(201).json({
                success: true,
                message: "Service created successfully",
                service,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to create service",
            });
        }
    }
);

/*
  PUT /api/services/:id
  Admin only
  Update a service
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
                    message: "Invalid service ID",
                });
            }

            const existingService =
                await db.orm.public.Service
                    .where({ id })
                    .first();

            if (!existingService) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found",
                });
            }

            const {
                title,
                description,
                iconUrl,
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

            const service =
                await db.orm.public.Service
                    .where({ id })
                    .update({
                        title,
                        description,
                        iconUrl: iconUrl || null,
                        featured: featured ?? false,
                    });

            res.json({
                success: true,
                message: "Service updated successfully",
                service,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to update service",
            });
        }
    }
);

/*
  DELETE /api/services/:id
  Admin only
  Delete a service
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
                    message: "Invalid service ID",
                });
            }

            const existingService =
                await db.orm.public.Service
                    .where({ id })
                    .first();

            if (!existingService) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found",
                });
            }

            const deletedService =
                await db.orm.public.Service
                    .where({ id })
                    .delete();

            res.json({
                success: true,
                message: "Service deleted successfully",
                service: deletedService,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to delete service",
            });
        }
    }
);

export default router;