import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../auth/authMiddleware.js";
import { requireAdmin } from "../auth/requireAdmin.js";

const router = express.Router();

/*
  GET /api/skills
  Public route
  Get all skills
*/
router.get("/", async (req, res) => {
    try {
        const skills = await db.orm.public.Skill
            .where({})
            .all();

        res.json({
            success: true,
            skills,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch skills",
        });
    }
});

/*
  GET /api/skills/:id
  Public route
  Get one skill
*/
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid skill ID",
            });
        }

        const skill = await db.orm.public.Skill
            .where({ id })
            .first();

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        res.json({
            success: true,
            skill,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch skill",
        });
    }
});

/*
  POST /api/skills
  Admin only
  Create a skill
*/
router.post(
    "/",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                name,
                category,
                level,
                iconUrl,
            } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Skill name is required",
                });
            }

            if (
                level !== undefined &&
                level !== null &&
                (typeof level !== "number" || level < 0 || level > 100)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Level must be a number between 0 and 100",
                });
            }

            const skill = await db.orm.public.Skill.create({
                name,
                category: category || null,
                level: level ?? null,
                iconUrl: iconUrl || null,
            });

            res.status(201).json({
                success: true,
                message: "Skill created successfully",
                skill,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to create skill",
            });
        }
    }
);

/*
  PUT /api/skills/:id
  Admin only
  Update a skill
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
                    message: "Invalid skill ID",
                });
            }

            const existingSkill = await db.orm.public.Skill
                .where({ id })
                .first();

            if (!existingSkill) {
                return res.status(404).json({
                    success: false,
                    message: "Skill not found",
                });
            }

            const {
                name,
                category,
                level,
                iconUrl,
            } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Skill name is required",
                });
            }

            if (
                level !== undefined &&
                level !== null &&
                (typeof level !== "number" || level < 0 || level > 100)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Level must be a number between 0 and 100",
                });
            }

            const skill = await db.orm.public.Skill
                .where({ id })
                .update({
                    name,
                    category: category || null,
                    level: level ?? null,
                    iconUrl: iconUrl || null,
                });

            res.json({
                success: true,
                message: "Skill updated successfully",
                skill,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to update skill",
            });
        }
    }
);

/*
  DELETE /api/skills/:id
  Admin only
  Delete a skill
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
                    message: "Invalid skill ID",
                });
            }

            const existingSkill = await db.orm.public.Skill
                .where({ id })
                .first();

            if (!existingSkill) {
                return res.status(404).json({
                    success: false,
                    message: "Skill not found",
                });
            }

            const deletedSkill = await db.orm.public.Skill
                .where({ id })
                .delete();

            res.json({
                success: true,
                message: "Skill deleted successfully",
                skill: deletedSkill,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to delete skill",
            });
        }
    }
);

export default router;