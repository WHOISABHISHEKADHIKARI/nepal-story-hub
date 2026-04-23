import type { IncomingMessage, ServerResponse } from "node:http";
import { callMcpTool, DEFAULT_PROJECT_SLUG } from "./_lib/mcp.js";

type Req = IncomingMessage & {
  query?: Record<string, string | string[]>;
  body?: any;
};

type Res = ServerResponse & {
  status?: (code: number) => Res;
  json?: (body: unknown) => void;
  setHeader: (name: string, value: string | string[]) => Res;
};

function json(res: Res, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function getQuery(req: Req, key: string) {
  const url = new URL(req.url || "/", "http://localhost");
  return url.searchParams.get(key);
}

function getPathParts(req: Req) {
  const url = new URL(req.url || "/", "http://localhost");
  return url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
}

function getBody(req: Req) {
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body ?? {};
}

async function handlePosts(req: Req, res: Res, parts: string[]) {
  if (req.method === "GET" && parts.length === 1) {
    const project_slug = getQuery(req, "project") || DEFAULT_PROJECT_SLUG;
    const page = Number(getQuery(req, "page") || "1");
    const per_page = Number(getQuery(req, "per_page") || "10");
    return json(res, 200, await callMcpTool("list_posts", { project_slug, page, per_page }));
  }

  if (req.method === "POST" && parts.length === 1) {
    return json(res, 200, await callMcpTool("create_post", getBody(req)));
  }

  const slug = parts[1];
  if (!slug) return json(res, 404, { error: "Not found" });

  if (req.method === "GET" && parts.length === 2) {
    return json(res, 200, await callMcpTool("get_post", { post_slug: slug }));
  }

  if (req.method === "PATCH" && parts.length === 2) {
    return json(res, 200, await callMcpTool("update_post", { ...getBody(req), post_slug: slug }));
  }

  if (req.method === "DELETE" && parts.length === 2) {
    return json(res, 200, await callMcpTool("delete_post", { post_slug: slug }));
  }

  if (req.method === "POST" && parts.length === 3 && parts[2] === "publish") {
    return json(res, 200, await callMcpTool("publish_post", { post_slug: slug }));
  }

  if (req.method === "POST" && parts.length === 3 && parts[2] === "unpublish") {
    return json(res, 200, await callMcpTool("unpublish_post", { post_slug: slug }));
  }

  return json(res, 404, { error: "Not found" });
}

async function handleCategories(req: Req, res: Res, parts: string[]) {
  if (req.method === "GET" && parts.length === 1) {
    const page = Number(getQuery(req, "page") || "1");
    const per_page = Number(getQuery(req, "per_page") || "50");
    return json(res, 200, await callMcpTool("list_categories", { page, per_page }));
  }

  if (req.method === "POST" && parts.length === 1) {
    return json(res, 200, await callMcpTool("create_category", getBody(req)));
  }

  if (req.method === "DELETE" && parts.length === 2) {
    return json(res, 200, await callMcpTool("delete_category", { category_slug: parts[1] }));
  }

  return json(res, 404, { error: "Not found" });
}

async function handleAuthors(req: Req, res: Res, parts: string[]) {
  if (req.method === "GET" && parts.length === 1) {
    const page = Number(getQuery(req, "page") || "1");
    const per_page = Number(getQuery(req, "per_page") || "50");
    return json(res, 200, await callMcpTool("list_authors", { page, per_page }));
  }

  if (req.method === "POST" && parts.length === 1) {
    return json(res, 200, await callMcpTool("create_author", getBody(req)));
  }

  if (req.method === "PATCH" && parts.length === 2) {
    return json(res, 200, await callMcpTool("update_author", { ...getBody(req), author_slug: parts[1] }));
  }

  if (req.method === "DELETE" && parts.length === 2) {
    return json(res, 200, await callMcpTool("delete_author", { author_slug: parts[1] }));
  }

  return json(res, 404, { error: "Not found" });
}

export default async function handler(req: Req, res: Res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const parts = getPathParts(req);

    if (parts.length === 0 || parts[0] === "healthz") {
      return json(res, 200, { status: "ok" });
    }

    if (parts[0] === "posts") {
      return await handlePosts(req, res, parts);
    }

    if (parts[0] === "categories") {
      return await handleCategories(req, res, parts);
    }

    if (parts[0] === "authors") {
      return await handleAuthors(req, res, parts);
    }

    return json(res, 404, { error: "Not found" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return json(res, 500, { error: message });
  }
}
