import { describe, expect, mock, test } from "bun:test";
import { isValidElement, type ReactNode } from "react";

const profile = {
  title: "Portfolio",
  description: "Description",
  url: "https://example.com",
  titleUrl: "Book a call",
  links: [],
};

const projects = [
  {
    id: "project",
    title: "Project",
    color: "#000000",
    coverImage: {
      src: "/images/projects/example/cover.png",
      alt: "Project cover",
    },
  },
];

function MockServicesWithAnimatedHoverModal() {
  return null;
}

const profileModule = await import("@/lib/profile.ts");
const projectsModule = await import("@/lib/projects.ts");

mock.module("@/lib/profile", () => ({
  ...profileModule,
  getProfile: async () => profile,
}));

mock.module("@/lib/projects", () => ({
  ...projectsModule,
  getProjects: async () => projects,
}));

mock.module("@/components/ui/services-with-animated-hover-modal", () => ({
  ServicesWithAnimatedHoverModal: MockServicesWithAnimatedHoverModal,
}));

const { default: Home } = await import("@/app/page.tsx");

describe("Home", () => {
  test("passes the profile URL to the project list", async () => {
    const element = await Home();
    const projectList = findElement(
      element,
      (node) =>
        isValidElement(node) &&
        node.type === MockServicesWithAnimatedHoverModal,
    );

    expect(projectList).not.toBeNull();
    expect(isValidElement(projectList) ? projectList.props.profileUrl : null)
      .toEqual({
        title: profile.titleUrl,
        url: profile.url,
      });
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
