import { describe, expect, test } from "bun:test";

import keystaticConfig from "./keystatic.config.ts";

describe("keystatic config", () => {
  test("only exposes the projects collection", () => {
    expect(Object.keys(keystaticConfig.collections)).toEqual(["projects"]);
  });

  test("generates a valid project color by default", () => {
    const colorField = keystaticConfig.collections.projects.schema.color;
    const allowedColors = ["#000000", "#1F150C", "#412D15", "#E1DCC9"];

    expect(colorField.kind).toBe("form");
    expect(allowedColors).toContain(colorField.defaultValue());
  });
});
