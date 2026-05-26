import { describe, expect, mock, test } from "bun:test";
import { isValidElement, type ReactNode } from "react";

const project = {
  id: "project",
  title: "Project",
  client: "Acme",
  date: "2026-05-25T09:00",
  order: 1,
  color: "#000000",
  coverImage: {
    src: "/images/projects/example/cover.png",
    alt: "Project cover",
  },
  images: [],
};

const profile = {
  title: "Portfolio",
  description: "Description",
  url: "https://example.com",
  titleUrl: "Book a call",
  links: [],
};

const projectsModule = await import("@/lib/projects.ts");
const profileModule = await import("@/lib/profile.ts");

mock.module("@/lib/projects", () => ({
  ...projectsModule,
  getProject: async () => project,
  getProjectIds: async () => [project.id],
}));

mock.module("@/lib/profile", () => ({
  ...profileModule,
  getProfile: async () => profile,
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

  test("renders the profile URL as a top-right external link", async () => {
    const element = await ProjectPage({
      params: Promise.resolve({ id: project.id }),
    });

    const link = findElement(
      element,
      (node) =>
        isValidElement(node) &&
        node.props.href === profile.url,
    );

    expect(toText(link)).toBe(profile.titleUrl);
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
