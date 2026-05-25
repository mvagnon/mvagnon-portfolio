import { describe, expect, test } from "bun:test";

import keystaticConfig from "./keystatic.config.ts";

describe("keystatic config", () => {
  test("only exposes the projects collection", () => {
    expect(Object.keys(keystaticConfig.collections)).toEqual(["projects"]);
  });
});
