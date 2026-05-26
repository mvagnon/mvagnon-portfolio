import { describe, expect, test } from "bun:test";

import {
  compareProjectEntries,
  normalizeProjectDate,
  toProject,
} from "@/lib/projects.ts";

const baseProjectEntry = {
  coverImage: {
    src: "/images/projects/example/cover.png",
    alt: "Example cover",
  },
  images: [
    {
      src: "/images/projects/example/images/0.png",
      alt: "Example 1",
    },
  ],
};

describe("project transforms", () => {
  test("sorts project entries by date descending", () => {
    const projects = [
      {
        ...baseProjectEntry,
        id: "older",
        title: "Older",
        date: "2026-05-23T09:00",
      },
      {
        ...baseProjectEntry,
        id: "newer",
        title: "Newer",
        date: "2026-05-25T09:00",
      },
      {
        ...baseProjectEntry,
        id: "middle",
        title: "Middle",
        date: "2026-05-24T09:00",
      },
    ].toSorted(compareProjectEntries);

    expect(projects.map((project) => project.id)).toEqual([
      "newer",
      "middle",
      "older",
    ]);
  });

  test("assigns deterministic colors from sorted position", () => {
    expect(toProject(baseProjectEntryWithId("first"), 0)).toMatchObject({
      id: "first",
      order: 1,
      color: "#000000",
    });
    expect(toProject(baseProjectEntryWithId("second"), 1)).toMatchObject({
      id: "second",
      order: 2,
      color: "#1F150C",
    });
    expect(toProject(baseProjectEntryWithId("fifth"), 4)).toMatchObject({
      id: "fifth",
      order: 5,
      color: "#000000",
    });
  });

  test("normalizes project date with legacy creation metadata fallback", () => {
    expect(normalizeProjectDate("2026-05-26T09:00", "2026-05-25T09:00"))
      .toBe("2026-05-26T09:00");
    expect(normalizeProjectDate(null, "2026-05-25T09:00")).toBe(
      "2026-05-25T09:00",
    );
    expect(normalizeProjectDate(null, new Date("2026-05-25T09:00:00.000Z")))
      .toBe("2026-05-25T09:00:00.000Z");
  });
});

function baseProjectEntryWithId(id) {
  return {
    ...baseProjectEntry,
    id,
    title: id,
    date: "2026-05-25T09:00",
  };
}
