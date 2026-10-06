import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../auth/authMiddleware.js";
import { requireAdmin } from "../auth/requireAdmin.js";

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const users = await db.orm.public.User
                .where({})
                .all();

            const safeUsers = users.map((user) => {
                const { password, ...safeUser } = user;
                return safeUser;
            });

            res.json({
                success: true,
                users: safeUsers,
            });
            
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to fetch users",
            });
        }
    }
);

export default router;