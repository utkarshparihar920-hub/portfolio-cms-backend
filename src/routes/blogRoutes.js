import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../auth/authMiddleware.js";
import { requireAdmin } from "../auth/requireAdmin.js";

const router = express.Router();

/*
  GET /api/blog
  Public route
  Get published blog posts
*/
router.get("/", async (req, res) => {
    try {
        const blogs = await db.orm.public.Blog
            .where({ published: true })
            .all();

        res.json({
            success: true,
            blogs,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blog posts",
        });
    }
});

/*
  GET /api/blog/:id
  Public route
  Get one published blog post by ID
*/
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID",
            });
        }

        const blog = await db.orm.public.Blog
            .where({ id, published: true })
            .first();

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Published blog post not found",
            });
        }

        res.json({
            success: true,
            blog,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blog post",
        });
    }
});

/*
  POST /api/blog
  Admin only
  Create a blog post
*/
router.post(
    "/",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                title,
                slug,
                excerpt,
                content,
                imageUrl,
                published,
                publishedAt,
            } = req.body;

            if (!title || !slug || !content) {
                return res.status(400).json({
                    success: false,
                    message: "Title, slug, and content are required",
                });
            }

            if (
                published !== undefined &&
                typeof published !== "boolean"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Published must be a boolean",
                });
            }

            const blog = await db.orm.public.Blog.create({
                title,
                slug,
                excerpt: excerpt || null,
                content,
                imageUrl: imageUrl || null,
                published: published ?? false,
                publishedAt: publishedAt || null,
            });

            res.status(201).json({
                success: true,
                message: "Blog post created successfully",
                blog,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to create blog post. Check that the slug is unique.",
            });
        }
    }
);

/*
  PUT /api/blog/:id
  Admin only
  Update a blog post
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
                    message: "Invalid blog ID",
                });
            }

            const existingBlog = await db.orm.public.Blog
                .where({ id })
                .first();

            if (!existingBlog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog post not found",
                });
            }

            const {
                title,
                slug,
                excerpt,
                content,
                imageUrl,
                published,
                publishedAt,
            } = req.body;

            if (!title || !slug || !content) {
                return res.status(400).json({
                    success: false,
                    message: "Title, slug, and content are required",
                });
            }

            if (
                published !== undefined &&
                typeof published !== "boolean"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Published must be a boolean",
                });
            }

            const blog = await db.orm.public.Blog
                .where({ id })
                .update({
                    title,
                    slug,
                    excerpt: excerpt || null,
                    content,
                    imageUrl: imageUrl || null,
                    published: published ?? false,
                    publishedAt: publishedAt || null,
                });

            res.json({
                success: true,
                message: "Blog post updated successfully",
                blog,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to update blog post. Check that the slug is unique.",
            });
        }
    }
);

/*
  DELETE /api/blog/:id
  Admin only
  Delete a blog post
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
                    message: "Invalid blog ID",
                });
            }

            const existingBlog = await db.orm.public.Blog
                .where({ id })
                .first();

            if (!existingBlog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog post not found",
                });
            }

            const deletedBlog = await db.orm.public.Blog
                .where({ id })
                .delete();

            res.json({
                success: true,
                message: "Blog post deleted successfully",
                blog: deletedBlog,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to delete blog post",
            });
        }
    }
);

export default router;