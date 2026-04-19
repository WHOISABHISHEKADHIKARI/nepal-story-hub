
import { Router } from "express";
import { mcpClient } from "../lib/mcp";

const router = Router();

router.get("/", async (req: any, res: any) => {
  try {
    const authors = await mcpClient.callTool("list_authors", {
        page: parseInt(req.query.page as string) || 1,
        per_page: parseInt(req.query.per_page as string) || 50
    });
    res.json(authors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const author = await mcpClient.callTool("create_author", req.body);
    res.json(author);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:slug", async (req: any, res: any) => {
  try {
    const author = await mcpClient.callTool("update_author", { ...req.body, author_slug: req.params.slug });
    res.json(author);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:slug", async (req: any, res: any) => {
  try {
    const result = await mcpClient.callTool("delete_author", { author_slug: req.params.slug });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
