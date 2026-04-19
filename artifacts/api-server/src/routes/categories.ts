
import { Router } from "express";
import { mcpClient } from "../lib/mcp";

const router = Router();

router.get("/", async (req: any, res: any) => {
  try {
    const categories = await mcpClient.callTool("list_categories", {
        page: parseInt(req.query.page as string) || 1,
        per_page: parseInt(req.query.per_page as string) || 50
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const category = await mcpClient.callTool("create_category", req.body);
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:slug", async (req: any, res: any) => {
  try {
    const result = await mcpClient.callTool("delete_category", { category_slug: req.params.slug });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
