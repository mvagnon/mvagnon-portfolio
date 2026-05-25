import { describe, expect, test } from "bun:test";

import keystaticConfig from "./keystatic.config.ts";

describe("keystatic config", () => {
  test("exposes projects and profile collections", () => {
    expect(Object.keys(keystaticConfig.collections)).toEqual([
      "projects",
      "profile",
    ]);
    expect(keystaticConfig.collections.profile.path).toBe("content/profile/*");
    expect(Object.keys(keystaticConfig.collections.profile.schema)).toEqual([
      "name",
      "description",
      "links",
    ]);
  });

  test("generates a valid project color by default", () => {
    const colorField = keystaticConfig.collections.projects.schema.color;
    const allowedColors = ["#000000", "#1F150C", "#412D15", "#E1DCC9"];

    expect(colorField.kind).toBe("form");
    expect(allowedColors).toContain(colorField.defaultValue());
  });
});
