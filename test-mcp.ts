import { mcpClient } from "./artifacts/api-server/src/lib/mcp";

async function test() {
    try {
        const sessionId = await (mcpClient as any).getSessionId();
        const response = await fetch('https://api.blogapiservice.com/mcp/mcp', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 4WH-su6gmBWlAuPp06MNeXecrVxWfjdSjM7D89vw0wk',
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream',
                'mcp-session-id': sessionId
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'tools/list',
                params: {},
                id: 'list'
            })
        });
        const data = await response.json();
        console.log("Available Tools:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

test();
