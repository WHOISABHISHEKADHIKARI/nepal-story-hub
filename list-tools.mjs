const MCP_URL = 'https://api.blogapiservice.com/mcp/mcp';
const AUTH_TOKEN = 'Bearer 4WH-su6gmBWlAuPp06MNeXecrVxWfjdSjM7D89vw0wk';

async function listTools() {
    try {
        const response = await fetch(MCP_URL, {
            method: 'POST',
            headers: {
                'Authorization': AUTH_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {},
                    clientInfo: { name: 'test', version: '1.0.0' }
                },
                id: 'init'
            })
        });

        const sessionId = response.headers.get('mcp-session-id');
        console.log("Session ID:", sessionId);

        const toolsResponse = await fetch(MCP_URL, {
            method: 'POST',
            headers: {
                'Authorization': AUTH_TOKEN,
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

        const bodyText = await toolsResponse.text();
        // SSE format: event: message\ndata: { ... }\n\n
        const lines = bodyText.split('\n');
        let data;
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const dataStr = line.substring(6);
                try {
                    data = JSON.parse(dataStr);
                    break;
                } catch (e) {}
            }
        }

        if (!data) {
            console.log("Full response text:", bodyText);
            return;
        }

        console.log("Tools List:");
        data.result.tools.forEach(t => {
            console.log(`- ${t.name}: ${t.description}`);
            console.log(`  Input Schema: ${JSON.stringify(t.inputSchema, null, 2)}`);
        });
    } catch (e) {
        console.error("Error:", e);
    }
}

listTools();
