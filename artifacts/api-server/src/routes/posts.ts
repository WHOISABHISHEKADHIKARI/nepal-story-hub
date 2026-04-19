
import { Router } from "express";
import { mcpClient } from "../lib/mcp";

const router = Router();

// We need a project slug. I'll use a default or allow it to be passed.
// Based on our discovery, project 18 or 46 are likely candidates.
// I'll try to use 'nepal-story-hub' as a default slug if it exists.
const DEFAULT_PROJECT_SLUG = 'abhishek-adhikari';

router.get("/", async (req: any, res: any) => {
  try {
    const project_slug = (req.query.project as string) || DEFAULT_PROJECT_SLUG;
    const posts = await mcpClient.callTool("list_posts", { 
        project_slug,
        page: parseInt(req.query.page as string) || 1,
        per_page: parseInt(req.query.per_page as string) || 10
    });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:slug", async (req: any, res: any) => {
  try {
    const post = await mcpClient.callTool("get_post", { post_slug: req.params.slug });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const post = await mcpClient.callTool("create_post", req.body);
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:slug", async (req: any, res: any) => {
  try {
    const post = await mcpClient.callTool("update_post", { ...req.body, post_slug: req.params.slug });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:slug", async (req: any, res: any) => {
  try {
    const post = await mcpClient.callTool("delete_post", { post_slug: req.params.slug });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:slug/publish", async (req: any, res: any) => {
  try {
    const result = await mcpClient.callTool("publish_post", { post_slug: req.params.slug });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:slug/unpublish", async (req: any, res: any) => {
  try {
    const result = await mcpClient.callTool("unpublish_post", { post_slug: req.params.slug });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
