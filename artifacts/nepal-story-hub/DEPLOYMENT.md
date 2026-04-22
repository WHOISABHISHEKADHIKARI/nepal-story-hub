# Vercel Deployment

This app is ready to deploy from GitHub to Vercel with Supabase auth and Vercel serverless `/api` routes.

## Vercel project

1. Import the GitHub repository into Vercel.
2. Set the **Root Directory** to `artifacts/nepal-story-hub`.
3. Framework preset: `Vite`.
4. Build command: `pnpm build`
5. Output directory: `dist/public`

## Vercel environment variables

Add these in Vercel Project Settings for Preview and Production:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `BLOG_API_MCP_URL`
- `BLOG_API_MCP_TOKEN`
- `BLOG_PROJECT_SLUG`
- `BASE_PATH=/`

`BLOG_API_MCP_TOKEN` must stay server-side only. Do not expose it in browser code.

## Supabase auth setup

In Supabase:

1. Go to `Authentication` -> `URL Configuration`
2. Set `Site URL` to your production Vercel domain
3. Add redirect URLs:
   - `http://localhost:5176/**`
   - `https://*-<your-vercel-team-or-account>.vercel.app/**`
   - your production domain, for example `https://your-site.vercel.app/**`

Supabase recommends setting your production site as `SITE_URL` and adding local plus Vercel preview URLs to the redirect allow list. Source: [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

## Google auth

If you want Google sign-in:

1. Go to `Authentication` -> `Providers` -> `Google`
2. Enable the provider
3. Add the callback URL Supabase gives you into Google Cloud Console
4. Save the Google client ID and secret in Supabase

If Google stays disabled, the app will fall back to email/password login.

## Routing

`vercel.json` rewrites non-API routes to `index.html` so TanStack Router works correctly on refresh and deep links.

## API layer

The frontend uses `/api/*` on the same Vercel deployment. These routes are implemented as Vercel functions and proxy server-side to the Blog API MCP service using:

- `BLOG_API_MCP_URL`
- `BLOG_API_MCP_TOKEN`
- `BLOG_PROJECT_SLUG`
