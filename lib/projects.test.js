import { describe, expect, test } from "bun:test";

import { getProjects } from "./projects.ts";

describe("getProjects", () => {
  test("returns configured projects with ids and images", async () => {
    const projects = await getProjects();

    expect(projects).toContainEqual({
      id: "test-project",
      title: "Test project",
      images: [
        {
          src: "/images/projects/test-project/images/0.png",
          alt: "Test project 1",
        },
        {
          src: "/images/projects/test-project/images/1.png",
          alt: "Test project 2",
        },
        {
          src: "/images/projects/test-project/images/2.png",
          alt: "Test project 3",
        },
      ],
    });
  });
});
