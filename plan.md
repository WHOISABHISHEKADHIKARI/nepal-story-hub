# Implementation Plan: Nepal Story Hub - MCP Integration

This document tracks the progress of connecting the Nepal Story Hub application to the external BlogAPIService via Model Context Protocol (MCP).

## Current Status
- [x] Initial discovery of BlogAPIService MCP server.
- [x] Creation of `mcp-settings.json` for local environment.
- [x] Implementation of `MCPClient` in `api-server` backend.
- [x] Exposure of MCP tools (Posts, Categories) via Express REST endpoints in `api-server`.
- [x] Configuration of Vite proxy to route `/api` calls to the `api-server`.
- [x] Partial migration of Frontend routes to use the new `mcpApi` client instead of Supabase:
    - [x] `blog.tsx` (Index)
    - [x] `index.tsx` (Home)
    - [x] `blog.$slug.tsx` (Post detail)
    - [x] `categories.tsx` (Categories list)
    - [x] `admin.posts.tsx` (Admin posts list)
    - [x] `admin.categories.tsx` (Admin categories list)
    - [x] `admin.index.tsx` (Admin dashboard stats)
    - [x] `admin.contributors.tsx` (Author management)
    - [x] `admin.review.tsx` (Post approval queue)
    - [x] `dashboard.new.tsx` (Create post)
    - [x] `dashboard.edit.$id.tsx` (Edit post)
    - [x] `become-contributor.tsx` (New author registration)

## Completed Tasks
- [x] Initial discovery of BlogAPIService MCP server.
- [x] Creation of `mcp-settings.json` for local environment.
- [x] Implementation of `MCPClient` in `api-server` backend.
- [x] Exposure of MCP tools (Posts, Categories, Authors) via Express REST endpoints in `api-server`.
- [x] Configuration of Vite proxy to route `/api` calls to the `api-server`.
- [x] Migration of all data-fetching Frontend routes to use the new `mcpApi` client.

## Future Considerations
- [ ] Implement Author login/auth mapping to MCP authors.
- [ ] Final verification of all data flows.
- [ ] Cleanup of unused Supabase tables (keeping Auth for now).

## Technical Details
- **Backend Proxy**: `artifacts/api-server/src/lib/mcp.ts` handles JSON-RPC communication over HTTP/SSE with the MCP server.
- **Frontend Client**: `artifacts/nepal-story-hub/src/lib/api-mcp.ts` provides a clean interface for the frontend to call the backend proxy.
- **Data Mapping**: MCP data structures (e.g., `MCPPost`) are mapped to the existing application types (e.g., `PostListItem`) to minimize UI changes.
