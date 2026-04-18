# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains **Hamro Katha** — a Nepal-themed community publication web app.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server artifact)
- **Database**: PostgreSQL + Drizzle ORM (api-server) + Supabase (nepal-story-hub)

## Artifacts

### Nepal Story Hub (`artifacts/nepal-story-hub`)
- **Frontend**: React + Vite + TanStack Router (file-based routing, manual routeTree.gen.ts)
- **Backend**: Supabase (hosted at rhowtozzsdrrfbzrcpfz.supabase.co)
- **Styling**: Tailwind CSS v4 with Nepal-inspired HSL palette (crimson primary, golden accent, warm cream bg)
- **Typography**: Cormorant Garamond (display), Source Serif 4 (body), Inter (UI)
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Routes**: `/`, `/blog`, `/blog/$slug`, `/categories`, `/categories/$slug`, `/about`, `/contact`, `/login`, `/become-contributor`, `/dashboard/new`, `/dashboard/edit/$id`, `/admin` (+ sub-routes)
- **Env vars**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

#### Color Scheme
- Primary: `hsl(355 68% 38%)` — Nepal flag crimson
- Accent: `hsl(38 88% 48%)` — golden saffron
- Background: `hsl(40 38% 96%)` — warm cream paper
- Foreground: `hsl(25 18% 14%)` — deep brown

#### Role System
- **Admin**: First user becomes admin (via DB trigger). Can publish directly, manage contributors/categories
- **Contributor**: Approved by admin. Can write posts, submit for review
- **Public**: Read-only access to published posts

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/nepal-story-hub run dev` — run Nepal Story Hub locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
