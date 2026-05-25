import { describe, expect, test } from "bun:test";

import keystaticConfig from "./keystatic.config.ts";

describe("keystatic config", () => {
  test("exposes projects and profile links collections", () => {
    expect(Object.keys(keystaticConfig.collections)).toEqual([
      "projects",
      "profileLinks",
    ]);
    expect(keystaticConfig.collections.profileLinks.path).toBe(
      "content/profile-links/*",
    );
  });

  test("generates a valid project color by default", () => {
    const colorField = keystaticConfig.collections.projects.schema.color;
    const allowedColors = ["#000000", "#1F150C", "#412D15", "#E1DCC9"];

    expect(colorField.kind).toBe("form");
    expect(allowedColors).toContain(colorField.defaultValue());
  });
});
