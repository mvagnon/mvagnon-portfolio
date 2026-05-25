import { describe, expect, test } from "bun:test";

import { getProjects } from "@/lib/projects.ts";

describe("getProjects", () => {
  test("returns configured projects with ids, cover images, links, and images", async () => {
    const projects = await getProjects();

    expect(projects).toContainEqual({
      id: "mvagnon-agents",
      title: "mvagnon/agents",
      order: 1,
      color: "#000000",
      coverImage: {
        src: "/images/projects/mvagnon-agents/coverImage.jpeg",
        alt: "mvagnon/agents cover",
      },
      github: "https://github.com/mvagnon/agents",
      url: undefined,
      images: [
        {
          src: "/images/projects/mvagnon-agents/images/0.png",
          alt: "mvagnon/agents 1",
        },
      ],
    });
  });

  test("uses collection position as project order and color index", async () => {
    const projects = await getProjects();

    expect(projects.map((project) => project.order)).toEqual([1, 2, 3]);
    expect(projects.map((project) => project.id)).toEqual([
      "mvagnon-agents",
      "ubby",
      "personal-dashboard",
    ]);
    expect(projects.map((project) => project.color)).toEqual([
      "#000000",
      "#1F150C",
      "#412D15",
    ]);

    for (let index = 1; index < projects.length; index += 1) {
      expect(projects[index]?.color).not.toBe(projects[index - 1]?.color);
    }
  });
});
