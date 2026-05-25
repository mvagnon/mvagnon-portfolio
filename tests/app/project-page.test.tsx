import { describe, expect, mock, test } from "bun:test";
import { isValidElement, type ReactNode } from "react";

const project = {
  id: "project",
  title: "Project",
  client: "Acme",
  createdAt: "2026-05-25T09:00",
  order: 1,
  color: "#000000",
  coverImage: {
    src: "/images/projects/example/cover.png",
    alt: "Project cover",
  },
  images: [],
};

const projectsModule = await import("@/lib/projects.ts");

mock.module("@/lib/projects", () => ({
  ...projectsModule,
  getProject: async () => project,
  getProjectIds: async () => [project.id],
}));

mock.module("@/components/project/project-gallery", () => ({
  ProjectGallery: () => null,
}));

const { default: ProjectPage } = await import("@/app/[id]/page.tsx");

describe("ProjectPage", () => {
  test("renders the client after the project title", async () => {
    const element = await ProjectPage({
      params: Promise.resolve({ id: project.id }),
    });

    const heading = findElement(
      element,
      (node) => isValidElement(node) && node.type === "h1",
    );

    expect(toText(heading)).toBe("Project \u2022 Acme");
  });
});

function findElement(
  node: ReactNode,
  predicate: (node: ReactNode) => boolean,
): ReactNode {
  if (predicate(node)) {
    return node;
  }

  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return null;
  }

  const children = node.props.children;

  if (Array.isArray(children)) {
    for (const child of children) {
      const match = findElement(child, predicate);

      if (match) {
        return match;
      }
    }

    return null;
  }

  return findElement(children, predicate);
}

function toText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(toText).join("");
  }

  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return "";
  }

  return toText(node.props.children);
}
