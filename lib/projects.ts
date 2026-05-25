import { createReader } from "@keystatic/core/reader";

import type { ImageItem } from "@/components/ui/3d-gallery-photography";

import keystaticConfig from "@/keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

const projectColors = ["#000000", "#1F150C", "#412D15", "#E1DCC9"] as const;

export type Project = {
  id: string;
  title: string;
  order: number;
  color: string;
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
  const projects = await Promise.all(
    projectIds.map((id, index) => readProject(id, index + 1)),
  );

  return projects.filter(isProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const projectIds = await getProjectIds();
  const projectIndex = projectIds.indexOf(id);

  if (projectIndex === -1) {
    return null;
  }

  return readProject(id, projectIndex + 1);
}

async function readProject(
  id: string,
  collectionPosition: number,
): Promise<Project | null> {
  const project = await reader.collections.projects.read(id);

  if (!project) {
    return null;
  }

  return {
    id,
    title: project.title,
    order: collectionPosition,
    color: getProjectColor(collectionPosition),
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

function getProjectColor(order: number) {
  return projectColors[(order - 1) % projectColors.length];
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
