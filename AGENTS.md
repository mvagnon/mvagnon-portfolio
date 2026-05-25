<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Instructions

## Stack

- This is a Bun-based Next.js portfolio using the App Router.
- Content is managed with Keystatic Cloud.
- Styling uses Tailwind CSS v4, shadcn/ui configuration, CSS variables in `app/globals.css`, and lucide icons.
- Interactive visual components may use Motion, Three.js, `@react-three/fiber`, and `@react-three/drei`.

## Commands

Use Bun commands by default:

```bash
bun run dev
bun run lint
bun run build
bun test
```

Do not run dev servers, containers, or browser automation by default. Run lint, build, and focused Bun tests when relevant to a change.

## Next.js Conventions

- Keep route UI in `app/` and use App Router file conventions.
- Server Components are the default. Add `"use client"` only for components that need hooks, browser APIs, Motion, or Three.js.
- In Next.js 16 route components, treat `params` and `searchParams` as async when the local docs require it.
- Keep data loading in Server Components or dedicated `lib/*` helpers, then pass serializable data to client components.
- Use `notFound()` from `next/navigation` for missing route data.
- Before editing Next.js code, read the relevant local documentation in `node_modules/next/dist/docs/`.

## Keystatic

- Keystatic config lives in `keystatic.config.ts`.
- The Keystatic Cloud project is `matthieu-vagnon/mvagnon-portfolio`.
- The admin UI is mounted under `app/keystatic`.
- The Keystatic route handler lives at `app/api/keystatic/[...params]/route.ts`.
- Project content uses the `projects` collection:
  - source files: `content/projects/*`
  - slug field: `title`
  - uploaded images: `public/images/projects`
  - public image path: `/images/projects/`
- Profile content uses the `profile` singleton:
  - source file: `content/profile/matthieu-vagnon.yaml`
  - `title` controls the home page metadata title
- Update `keystatic.config.ts`, content files, and readers together when changing content schema.

## Project Structure

- `lib/projects.ts` is the reader layer for project content.
- `components/project/*` contains project-specific presentation wrappers.
- `components/ui/*` contains reusable UI or imported/customized UI building blocks.
- Project list route lives at `app/page.tsx`; project detail routes live under `app/[id]`.
- Use the `@/*` import alias instead of deep relative imports when it improves readability.

## UI Rules

- Prefer existing shadcn/Tailwind tokens and utilities over new ad hoc styling.
- Keep portfolio pages visual and polished, but avoid unrelated redesigns.
- Use lucide icons when an icon is needed.
- Keep text responsive and avoid overlap across mobile and desktop.
- Preserve dark mode support when touching shared styles.

## Tests and Documentation

- Use `bun test` for `bun:test` files.
- Keep route tests aligned with actual `app/` route placement when routes move.
- Do not test exact Keystatic content values. Content files are editable CMS data, not stable fixtures. Test schemas, readers with synthetic data, and transformation logic instead.
- Update `README.md` when setup, commands, routes, content schema, or architecture changes.
