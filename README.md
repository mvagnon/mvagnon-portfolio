# mvagnon-portfolio

Next.js portfolio managed with Keystatic local storage.

## Commands

```bash
bun run dev
bun run lint
bun run build
bun test
```

Tests live in `tests/`.

## Content

Keystatic is available at `/keystatic`.

Projects are configured in the `projects` collection. Each project uses the title as its slug, stores content in `content/projects/*`, and stores uploaded images in `public/images/projects`.

Project entries include a generated color, a required cover image for the `/` hover preview, a required image gallery, and optional `github` and `url` links.

Profile content is configured in the `profile` singleton. It lives in `content/profile/matthieu-vagnon.yaml` and controls the page title, description, and icon buttons rendered on `/`.

The project index is available at `/` and renders the animated hover list with profile content. Project detail pages are available at `/:id` and render the project title with its images in the 3D gallery.
