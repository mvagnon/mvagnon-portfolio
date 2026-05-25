import { createReader } from "@keystatic/core/reader";

import type { ImageItem } from "@/components/ui/3d-gallery-photography";

import keystaticConfig from "@/keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

export type Project = {
  id: string;
  title: string;
  coverImage: ImageItem;
  github?: string;
  url?: string;
  images: ImageItem[];
};

export async function getProjectIds() {
  return reader.collections.projects.list();
}

export async function getProjects(): Promise<Project[]> {
  const projectIds = await getProjectIds();
  const projects = await Promise.all(projectIds.map((id) => getProject(id)));

  return projects.filter(isProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const project = await reader.collections.projects.read(id);

  if (!project) {
    return null;
  }

  return {
    id,
    title: project.title,
    coverImage: {
      src: project.coverImage,
      alt: `${project.title} cover`,
    },
    github: normalizeOptionalUrl(project.github),
    url: normalizeOptionalUrl(project.url),
    images: project.images
      .filter(isImagePath)
      .map((src, index) => ({
        src,
        alt: `${project.title} ${index + 1}`,
      })),
  };
}

function normalizeOptionalUrl(url: string | null): string | undefined {
  return typeof url === "string" && url.length > 0 ? url : undefined;
}

function isImagePath(image: string | null): image is string {
  return typeof image === "string" && image.length > 0;
}

function isProject(project: Project | null): project is Project {
  return project !== null;
}
