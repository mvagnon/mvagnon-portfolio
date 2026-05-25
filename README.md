# mvagnon-portfolio

Next.js portfolio managed with Keystatic local storage.

## Commands

```bash
bun run dev
bun run lint
bun run build
```

## Content

Keystatic is available at `/keystatic`.

Projects are configured in the `projects` collection. Each project uses the title as its slug, stores content in `content/projects/*`, and stores uploaded images in `public/images/projects`.

The project index is available at `/` and renders the animated hover list. Project detail pages are available at `/:id` and render the project title with its images in the 3D gallery.
