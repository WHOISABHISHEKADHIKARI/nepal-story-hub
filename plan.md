# Redesign Execution Plan

## Goal

Turn the public-facing product into a coherent editorial publication with a Medium-like reading experience, while keeping the auth/CMS architecture honest and the contributor workflow functional.

## Steps

- [x] 1. Audit the current architecture
  Review public routes, shared layout, auth surfaces, CMS integration points, and editor/dashboard flows to identify design and data-shape mismatches.

- [x] 2. Tighten the publication design system
  Create stronger shared editorial primitives in the global stylesheet so the public app uses one visual language instead of page-by-page styling.

- [x] 3. Rebuild the shared shell
  Redesign the public header, footer, layout wrapper, and story card components so every page inherits the same publication structure.

- [x] 4. Redesign the key public pages
  Refit home, about, contact, categories, category detail, contributor application, and article detail screens to the new editorial system.

- [x] 5. Fix architectural mismatches discovered during the audit
  Remove broken assumptions in data mapping and editor submission flows so CMS-backed pages and creation flows use real MCP data instead of incorrect hardcoded values.

- [ ] 6. Verify and polish
  Run typecheck, inspect the redesigned routes in the browser, and do a final pass on any issues revealed by live screenshots.
