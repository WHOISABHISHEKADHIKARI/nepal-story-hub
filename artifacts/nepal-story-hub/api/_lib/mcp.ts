const MCP_URL = process.env.BLOG_API_MCP_URL || "https://api.blogapiservice.com/mcp/mcp";
const AUTH_TOKEN = process.env.BLOG_API_MCP_TOKEN;
const DEFAULT_PROJECT_SLUG = process.env.BLOG_PROJECT_SLUG || "abhishek-adhikari";

type MCPEnvelope<T = unknown> = {
  jsonrpc: string;
  id: number | string;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
};

type MCPSessionState = {
  sessionId?: string;
};

const globalState = globalThis as typeof globalThis & {
  __hamroKathaMcp?: MCPSessionState;
};

const state = globalState.__hamroKathaMcp ?? (globalState.__hamroKathaMcp = {});

function requireToken() {
  if (!AUTH_TOKEN) {
    throw new Error("Missing BLOG_API_MCP_TOKEN environment variable.");
  }
}

async function parseMcpResponse<T>(response: Response): Promise<T> {
  const bodyText = await response.text();

  let dataStr = bodyText;
  if (bodyText.startsWith("event: message")) {
    const match = bodyText.match(/data: (.*)/);
    if (match) dataStr = match[1];
  }

  let data: MCPEnvelope;
  try {
    data = JSON.parse(dataStr) as MCPEnvelope;
  } catch {
    throw new Error("Failed to parse MCP response.");
  }

  if (data.error) {
    throw new Error(`MCP Error: ${data.error.message} (${data.error.code})`);
  }

  if (data.result && typeof (data.result as any).content?.[0]?.text === "string") {
    const text = (data.result as any).content[0].text;
    if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
      return JSON.parse(text) as T;
    }
    return text as T;
  }

  return data.result as T;
}

async function getSessionId() {
  requireToken();

  if (state.sessionId) {
    return state.sessionId;
  }

  const response = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      Authorization: AUTH_TOKEN!,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "hamro-katha-vercel", version: "1.0.0" },
      },
      id: "init",
    }),
  });

  const sessionId = response.headers.get("mcp-session-id");
  if (!sessionId) {
    throw new Error("Failed to get MCP session ID.");
  }

  await response.text();
  state.sessionId = sessionId;
  return sessionId;
}

export async function callMcpTool<T = unknown>(name: string, args: Record<string, unknown> = {}) {
  const sessionId = await getSessionId();

  const response = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      Authorization: AUTH_TOKEN!,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "mcp-session-id": sessionId,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name,
        arguments: args,
      },
      id: Date.now(),
    }),
  });

  return parseMcpResponse<T>(response);
}

export { DEFAULT_PROJECT_SLUG };
