import { describe, expect, test } from "bun:test";

import keystaticConfig from "@/keystatic.config.ts";

describe("keystatic config", () => {
  test("uses the Keystatic Cloud project", () => {
    expect(keystaticConfig.storage.kind).toBe("cloud");
    expect(keystaticConfig.cloud.project).toBe(
      "matthieu-vagnon/mvagnon-portfolio",
    );
  });

  test("exposes the projects collection and profile singleton", () => {
    expect(Object.keys(keystaticConfig.collections)).toEqual(["projects"]);
    expect(Object.keys(keystaticConfig.singletons)).toEqual(["profile"]);
    expect(keystaticConfig.singletons.profile.path).toBe(
      "content/profile/matthieu-vagnon",
    );
    expect(Object.keys(keystaticConfig.singletons.profile.schema)).toEqual([
      "title",
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

  test("uses a multi-image upload field for project gallery images", () => {
    const imagesField = keystaticConfig.collections.projects.schema.images;

    expect(imagesField.kind).toBe("form");
    expect(imagesField.formKind).toBe("assets");
    expect(imagesField.defaultValue()).toEqual([]);
  });
});
