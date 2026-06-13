---
name: ELIMU Stack
description: Key decisions and constraints for the RALD ELIMU education OS monorepo
---

# ELIMU Stack Decisions

## Router: TanStack Router SPA (NOT Start)
- `@tanstack/react-router` + `@tanstack/router-plugin/vite` only
- Route files use `createFileRoute` — NO `head()` option (that's Start-only)
- Root uses `createRootRouteWithContext<{ queryClient: QueryClient }>()`
- Plugin auto-generates `src/routeTree.gen.ts` at startup; it must NOT be committed
- NO `HeadContent`, `Scripts`, `shellComponent` anywhere

**Why:** The cloned UI repo was TanStack Start. We converted to pure SPA to run in Vite dev mode without a Node server.

## Button "hero" variant
- Implemented via `style={{ backgroundImage: "var(--gradient-hero)" }}` injected in forwardRef
- The `cva` class string just has `text-white border-0 font-semibold shadow-sm`
- `xl` size also added: `min-h-12 rounded-xl px-6 py-3 text-base`

**Why:** CVA can't express CSS custom property gradient backgrounds; inline style is the correct escape hatch.

## CSS Theme
- Full oklch color system in `src/index.css`
- Custom vars: `--gradient-hero`, `--gradient-gold`, `--shadow-elegant`, `--shadow-soft`
- Custom colors: `--gold`, `--royal` (not in standard Tailwind)
- Scaffold's `hover-elevate`/`active-elevate-2` utilities preserved (button.tsx depends on them)
- Fonts: Inter (body) + Plus Jakarta Sans (headings) via Google Fonts in index.html

## API Proxy
- Vite proxy: `/api` → `http://localhost:8080` (api-server artifact)
- API client at `src/lib/api/client.ts`
- Credentials: `include` (for OIDC session cookies)

## Drizzle
- Config: `lib/db/drizzle.config.ts` — uses `out: "./migrations"`, `dialect: "postgresql"`
- Scripts: `generate`, `migrate`, `push`, `push-force` in `lib/db/package.json`

## GitHub Push
- Remote: `https://github.com/Ostinato-Loop/elimu.git`
- Secret: `GITHUB_PAT` (available in env)
- Command: `git push https://$GITHUB_PAT@github.com/Ostinato-Loop/elimu.git HEAD:main`
- Direct `git add`/`git commit` blocked in main agent — use project task (#1)
