import { describe, expect, test } from "bun:test";

import { ServicesWithAnimatedHoverModal } from "@/components/ui/services-with-animated-hover-modal";

import Home from "./page";

type ElementLike = {
  type: unknown;
  props?: {
    children?: unknown;
    profileDescription?: unknown;
    profileLinks?: unknown;
  };
};

describe("Home", () => {
  test("passes the configured profile to the project list", async () => {
    const page = await Home();
    const projectList = findFirstElement(
      page,
      (element) => element.type === ServicesWithAnimatedHoverModal,
    );

    expect(projectList?.props?.profileDescription).toBe(
      "Je m'appelle Matthieu Vagnon, développeur full-stack et architecte logiciel. Dans mes projets, je recherche la perfection: je ne livre que des expériences premium, soignées et léchées.",
    );
    expect(projectList?.props?.profileLinks).toEqual([
      {
        id: "github",
        title: "GitHub",
        order: 1,
        url: "https://github.com/mvagnon",
        icon: "github",
      },
      {
        id: "linkedin",
        title: "LinkedIn",
        order: 2,
        url: "https://fr.linkedin.com/in/matthieu-vagnon",
        icon: "linkedin",
      },
      {
        id: "malt",
        title: "Malt",
        order: 3,
        url: "https://www.malt.fr/profile/matthieuvagnon1",
        icon: "malt",
      },
    ]);
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

  return [...matches, ...findElements(node.props?.children, predicate)];
}

function isElementLike(node: unknown): node is ElementLike {
  return typeof node === "object" && node !== null && "type" in node;
}
