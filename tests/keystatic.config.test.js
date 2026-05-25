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
    expect(keystaticConfig.collections.projects.columns).toEqual([
      "title",
      "client",
      "createdAt",
    ]);
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

  test("exposes an optional project client field after the title", () => {
    expect(Object.keys(keystaticConfig.collections.projects.schema).slice(0, 3))
      .toEqual(["title", "client", "createdAt"]);

    const clientField = keystaticConfig.collections.projects.schema.client;

    expect(clientField.kind).toBe("form");
    expect(clientField.label).toBe("Client");
  });

  test("requires a project creation datetime", () => {
    const createdAtField =
      keystaticConfig.collections.projects.schema.createdAt;

    expect(createdAtField.kind).toBe("form");
    expect(createdAtField.label).toBe("Created at");
    expect(createdAtField.defaultValue()).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
    );
  });

  test("sorts projects by creation datetime descending by default", () => {
    expect(keystaticConfig.collections.projects.sortBy).toEqual({
      field: "createdAt",
      direction: "descending",
    });
  });

  test("accepts legacy project order metadata without exposing it", () => {
    const orderField = keystaticConfig.collections.projects.schema.order;

    expect(orderField.kind).toBe("form");
    expect(orderField.label).toBe("Ignored");
    expect(orderField.parse(1)).toEqual({ value: 1 });
  });

  test("accepts legacy project color metadata without exposing it", () => {
    const colorField = keystaticConfig.collections.projects.schema.color;

    expect(colorField.kind).toBe("form");
    expect(colorField.label).toBe("Ignored");
    expect(colorField.parse("#412D15")).toEqual({ value: "#412D15" });
  });

  test("uses a multi-image upload field for project gallery images", () => {
    const imagesField = keystaticConfig.collections.projects.schema.images;

    expect(imagesField.kind).toBe("form");
    expect(imagesField.formKind).toBe("assets");
    expect(imagesField.defaultValue()).toEqual([]);
  });
});
