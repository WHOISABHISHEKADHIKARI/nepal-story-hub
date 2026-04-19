import { logger } from "./logger";

const MCP_URL = 'https://api.blogapiservice.com/mcp/mcp';
const AUTH_TOKEN = 'Bearer 4WH-su6gmBWlAuPp06MNeXecrVxWfjdSjM7D89vw0wk';

export interface MCPResponse<T = any> {
    jsonrpc: string;
    id: number | string;
    result?: T;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

export class MCPClient {
    private sessionId: string | null = null;

    private async getSessionId(): Promise<string> {
        if (this.sessionId) return this.sessionId;

        logger.info('Initializing MCP session...');
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
                    clientInfo: { name: 'nepal-story-hub-backend', version: '1.0.0' }
                },
                id: 'init'
            })
        }) as any;

        this.sessionId = response.headers.get('mcp-session-id');
        if (!this.sessionId) {
            throw new Error('Failed to get MCP session ID');
        }

        // Wait for initialize response to be processed (optional but good practice)
        await response.text();
        logger.info({ sessionId: this.sessionId }, 'MCP session initialized');
        
        return this.sessionId;
    }

    async callTool<T = any>(name: string, args: any = {}): Promise<T> {
        const sessionId = await this.getSessionId();

        const response = await fetch(MCP_URL, {
            method: 'POST',
            headers: {
                'Authorization': AUTH_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream',
                'mcp-session-id': sessionId
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'tools/call',
                params: {
                    name,
                    arguments: args
                },
                id: Date.now()
            })
        }) as any;

        const bodyText = await response.text();
        
        // Handle SSE format if necessary
        let dataStr = bodyText;
        if (bodyText.startsWith('event: message')) {
            const match = bodyText.match(/data: (.*)/);
            if (match) dataStr = match[1];
        }

        let data: MCPResponse;
        try {
            data = JSON.parse(dataStr) as MCPResponse;
        } catch (e) {
            logger.error({ bodyText }, 'Failed to parse MCP response');
            throw new Error('Failed to parse MCP response');
        }

        logger.info({ name, args, data }, 'MCP Tool response');

        if (data.error) {
            throw new Error(`MCP Error: ${data.error.message} (${data.error.code})`);
        }

        if (data.result && (data.result as any).isError) {
             const content = (data.result as any).content?.[0]?.text || 'Unknown error';
             throw new Error(`MCP Tool Error: ${content}`);
        }

        // Most tools return a JSON string in the 'result' field
        if (data.result && typeof (data.result as any).content?.[0]?.text === 'string') {
            const text = (data.result as any).content[0].text;
            try {
                // Try to parse if it's JSON
                if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
                    return JSON.parse(text);
                }
            } catch (e) {
                // If not JSON, return as is
                return text as unknown as T;
            }
        }

        return data.result as T;
    }
}

export const mcpClient = new MCPClient();
