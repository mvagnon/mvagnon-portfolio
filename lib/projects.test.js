import { describe, expect, test } from "bun:test";

import { getProjects } from "./projects.ts";

describe("getProjects", () => {
  test("returns configured projects with ids, cover images, links, and images", async () => {
    const projects = await getProjects();

    expect(projects).toContainEqual({
      id: "test-project",
      title: "Test project",
      coverImage: {
        src: "/images/projects/test-project/images/0.png",
        alt: "Test project cover",
      },
      github: "https://github.com/mvagnon/test-project",
      url: "https://test-project.example.com",
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
