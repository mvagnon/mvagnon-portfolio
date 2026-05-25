import { describe, expect, test } from "bun:test";

import { getProjects } from "@/lib/projects.ts";

describe("getProjects", () => {
  test("returns configured projects with ids, cover images, links, and images", async () => {
    const projects = await getProjects();

    expect(projects).toContainEqual({
      id: "mvagnon-agents",
      title: "mvagnon/agents",
      color: "#412D15",
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
});
