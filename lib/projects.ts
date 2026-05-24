import { createReader } from "@keystatic/core/reader";

import type { ImageItem } from "@/components/ui/3d-gallery-photography";

import keystaticConfig from "@/keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

export type Project = {
  id: string;
  title: string;
  images: ImageItem[];
};

export async function getProjectIds() {
  return reader.collections.projects.list();
}

export async function getProject(id: string): Promise<Project | null> {
  const project = await reader.collections.projects.read(id);

  if (!project) {
    return null;
  }

  return {
    id,
    title: project.title,
    images: project.images
      .filter(isImagePath)
      .map((src, index) => ({
        src,
        alt: `${project.title} ${index + 1}`,
      })),
  };
}

function isImagePath(image: string | null): image is string {
  return typeof image === "string" && image.length > 0;
}
