import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../auth/authMiddleware.js";
import { requireAdmin } from "../auth/requireAdmin.js";

const router = express.Router();

/*
  POST /api/messages
  Public route
  Submit a contact message
*/
router.post("/", async (req, res) => {
    try {
        const {
            name,
            email,
            subject,
            message,
        } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and message are required",
            });
        }

        const newMessage = await db.orm.public.Message.create({
            name,
            email,
            subject: subject || null,
            message,
            read: false,
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to send message",
        });
    }
});

/*
  GET /api/messages
  Admin only
  Get all contact messages
*/
router.get(
    "/",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const messages = await db.orm.public.Message
                .where({})
                .all();

            res.json({
                success: true,
                messages,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to fetch messages",
            });
        }
    }
);

/*
  GET /api/messages/:id
  Admin only
  Get one message
*/
router.get(
    "/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid message ID",
                });
            }

            const contactMessage = await db.orm.public.Message
                .where({ id })
                .first();

            if (!contactMessage) {
                return res.status(404).json({
                    success: false,
                    message: "Message not found",
                });
            }

            res.json({
                success: true,
                message: contactMessage,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to fetch message",
            });
        }
    }
);

/*
  PUT /api/messages/:id
  Admin only
  Mark message as read/unread
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
                    message: "Invalid message ID",
                });
            }

            const existingMessage = await db.orm.public.Message
                .where({ id })
                .first();

            if (!existingMessage) {
                return res.status(404).json({
                    success: false,
                    message: "Message not found",
                });
            }

            const { read } = req.body;

            if (typeof read !== "boolean") {
                return res.status(400).json({
                    success: false,
                    message: "Read must be a boolean",
                });
            }

            const updatedMessage = await db.orm.public.Message
                .where({ id })
                .update({
                    read,
                });

            res.json({
                success: true,
                message: "Message status updated successfully",
                data: updatedMessage,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to update message",
            });
        }
    }
);

/*
  DELETE /api/messages/:id
  Admin only
  Delete a message
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
                    message: "Invalid message ID",
                });
            }

            const existingMessage = await db.orm.public.Message
                .where({ id })
                .first();

            if (!existingMessage) {
                return res.status(404).json({
                    success: false,
                    message: "Message not found",
                });
            }

            const deletedMessage = await db.orm.public.Message
                .where({ id })
                .delete();

            res.json({
                success: true,
                message: "Message deleted successfully",
                data: deletedMessage,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to delete message",
            });
        }
    }
);

export default router;