# mvagnon-portfolio

Next.js portfolio managed with Keystatic Cloud.

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

The Keystatic Cloud project is `matthieu-vagnon/mvagnon-portfolio`.

Projects are configured in the `projects` collection. Each project uses the title as its slug, stores content in `content/projects/*`, and stores uploaded images and videos in `public/images/projects`.

Project entries include a required title, an optional client, an optional date with no default value, a required cover image or video for the `/` hover preview and project detail gallery, optional additional gallery images and videos, and optional `github` and `url` links. Projects are sorted by date in descending order, and background colors are generated from that sorted position.

The cover and gallery use Keystatic's file fields, preserving existing image paths. Gallery uploads are stored in `public/images/projects/<project-slug>/images`. MP4 and WebM are recommended for videos, which play automatically in a silent loop without controls in previews, the 3D gallery, and fullscreen.

Profile content is configured in the `profile` singleton. It lives in `content/profile/matthieu-vagnon.yaml` and controls the page title, description, optional featured URL, and icon buttons rendered on `/`. Profile link icons can use `coffee`, `github`, `linkedin`, or `link`. The featured URL is rendered only when both `url` and `titleUrl` are set.

The project index is available at `/` and renders the animated hover list with profile content. Project detail pages are available at `/:id` and render the project title, optional client, and images in the 3D gallery.
