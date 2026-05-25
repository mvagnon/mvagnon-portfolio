import { createReader } from "@keystatic/core/reader";

import type { ImageItem } from "@/components/ui/3d-gallery-photography";

import keystaticConfig from "@/keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

const projectColors = ["#000000", "#1F150C", "#412D15", "#E1DCC9"] as const;

export type Project = {
  id: string;
  title: string;
  client?: string;
  createdAt: string;
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
  const projectEntries = await Promise.all(
    projectIds.map((id) => readProjectEntry(id)),
  );

  return projectEntries
    .filter(isProjectEntry)
    .toSorted(compareProjectEntries)
    .map(toProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = await getProjects();

  return projects.find((project) => project.id === id) ?? null;
}

export type ProjectEntry = Omit<Project, "color" | "order">;

async function readProjectEntry(id: string): Promise<ProjectEntry | null> {
  const project = await reader.collections.projects.read(id);

  if (!project) {
    return null;
  }

  return {
    id,
    title: project.title,
    client: normalizeOptionalText(project.client),
    createdAt: project.createdAt,
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

export function toProject(project: ProjectEntry, index: number): Project {
  const order = index + 1;

  return {
    ...project,
    order,
    color: getProjectColor(order),
  };
}

export function compareProjectEntries(a: ProjectEntry, b: ProjectEntry) {
  return (
    b.createdAt.localeCompare(a.createdAt) ||
    a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
  );
}

function getProjectColor(order: number) {
  return projectColors[(order - 1) % projectColors.length];
}

function normalizeOptionalUrl(url: string | null): string | undefined {
  return typeof url === "string" && url.length > 0 ? url : undefined;
}

function normalizeOptionalText(text: string | null): string | undefined {
  const value = typeof text === "string" ? text.trim() : "";

  return value.length > 0 ? value : undefined;
}

function isImagePath(image: string | null): image is string {
  return typeof image === "string" && image.length > 0;
}

function isProjectEntry(
  project: ProjectEntry | null,
): project is ProjectEntry {
  return project !== null;
}
