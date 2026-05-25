import { describe, expect, test } from "bun:test";

import { IconButton } from "@/components/ui/icon-button";

import ProjectPage from "./page";

type ElementLike = {
  type: unknown;
  props?: {
    children?: unknown;
    href?: unknown;
    rel?: unknown;
    src?: unknown;
    target?: unknown;
    "aria-label"?: unknown;
  };
};

describe("ProjectPage", () => {
  test("renders production and GitHub links under the title", async () => {
    const page = await ProjectPage({
      params: Promise.resolve({ id: "test-project" }),
    });

    const projectLinks = findElements(
      page,
      (element) =>
        element.type === IconButton &&
        element.props?.href !== "/" &&
        typeof element.props?.href === "string",
    ).map((element) => ({
      ariaLabel: element.props?.["aria-label"],
      href: element.props?.href,
      icon: findFirstElement(
        element.props?.children,
        (child) => typeof child.props?.src === "string",
      )?.props?.src,
      rel: element.props?.rel,
      target: element.props?.target,
    }));

    expect(projectLinks).toContainEqual({
      ariaLabel: "Voir le projet en production",
      href: "https://test-project.example.com",
      icon: "/url.svg",
      rel: "noopener noreferrer",
      target: "_blank",
    });
    expect(projectLinks).toContainEqual({
      ariaLabel: "Voir le code source sur GitHub",
      href: "https://github.com/mvagnon/test-project",
      icon: "/github.svg",
      rel: "noopener noreferrer",
      target: "_blank",
    });
  });
});

function findFirstElement(
  node: unknown,
  predicate: (element: ElementLike) => boolean,
): ElementLike | undefined {
  return findElements(node, predicate).at(0);
}

function findElements(
  node: unknown,
  predicate: (element: ElementLike) => boolean,
): ElementLike[] {
  if (Array.isArray(node)) {
    return node.flatMap((child) => findElements(child, predicate));
  }

  if (!isElementLike(node)) {
    return [];
  }

  const matches = predicate(node) ? [node] : [];

  return [
    ...matches,
    ...findElements(node.props?.children, predicate),
  ];
}

function isElementLike(node: unknown): node is ElementLike {
  return typeof node === "object" && node !== null && "type" in node;
}
