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
      "date",
    ]);
    expect(Object.keys(keystaticConfig.singletons)).toEqual(["profile"]);
    expect(keystaticConfig.singletons.profile.path).toBe(
      "content/profile/matthieu-vagnon",
    );
    expect(Object.keys(keystaticConfig.singletons.profile.schema)).toEqual([
      "title",
      "description",
      "url",
      "titleUrl",
      "links",
    ]);
  });

  test("requires a project title", () => {
    const titleField = keystaticConfig.collections.projects.schema.title;

    expect(titleField.kind).toBe("form");
    expect(titleField.label).toBe("Title");
    expect(() =>
      titleField.validate({ name: "", slug: "project-slug" }),
    ).toThrow("Title must not be empty");
  });

  test("exposes an optional project client field after the title", () => {
    expect(Object.keys(keystaticConfig.collections.projects.schema).slice(0, 3))
      .toEqual(["title", "client", "date"]);

    const clientField = keystaticConfig.collections.projects.schema.client;

    expect(clientField.kind).toBe("form");
    expect(clientField.label).toBe("Client");
  });

  test("exposes a project date", () => {
    const dateField = keystaticConfig.collections.projects.schema.date;

    expect(dateField.kind).toBe("form");
    expect(dateField.label).toBe("Date");
    expect(dateField.defaultValue()).toBeNull();
  });

  test("sorts projects by date descending by default", () => {
    expect(keystaticConfig.collections.projects.sortBy).toEqual({
      field: "date",
      direction: "descending",
    });
  });

  test("exposes an optional profile URL with a title", () => {
    const { url, titleUrl } = keystaticConfig.singletons.profile.schema;

    expect(url.kind).toBe("form");
    expect(url.label).toBe("URL");
    expect(titleUrl.kind).toBe("form");
    expect(titleUrl.label).toBe("Title URL");
  });

  test("accepts legacy project order metadata without exposing it", () => {
    const orderField = keystaticConfig.collections.projects.schema.order;

    expect(orderField.kind).toBe("form");
    expect(orderField.label).toBe("Ignored");
    expect(orderField.parse(1)).toEqual({ value: 1 });
  });

  test("accepts legacy project creation metadata without exposing it", () => {
    const createdAtField =
      keystaticConfig.collections.projects.schema.createdAt;

    expect(createdAtField.kind).toBe("form");
    expect(createdAtField.label).toBe("Ignored");
    expect(createdAtField.parse("2026-05-25T09:00:00.000Z")).toEqual({
      value: "2026-05-25T09:00:00.000Z",
    });
  });

  test("accepts legacy project color metadata without exposing it", () => {
    const colorField = keystaticConfig.collections.projects.schema.color;

    expect(colorField.kind).toBe("form");
    expect(colorField.label).toBe("Ignored");
    expect(colorField.parse("#412D15")).toEqual({ value: "#412D15" });
  });

  test("uses asset fields for an optional image and video gallery", () => {
    const imagesField = keystaticConfig.collections.projects.schema.images;

    expect(imagesField.kind).toBe("array");
    expect(imagesField.label).toBe("Images and videos");
    expect(imagesField.validation?.length?.min ?? 0).toBe(0);

    expect(imagesField.element.kind).toBe("form");
    expect(imagesField.element.formKind).toBe("asset");
    expect(imagesField.element.label).toBe("Image or video");
    expect(imagesField.element.directory).toBe("public/images/projects");
  });

  test("preserves image and video paths when reading and saving project media", () => {
    const { coverImage, images } = keystaticConfig.collections.projects.schema;

    for (const field of [coverImage, images.element]) {
      expect(() => field.validate(null)).toThrow();

      for (const extension of ["png", "gif", "mp4", "webm"]) {
        const path = `/images/projects/example/cover.${extension}`;
        const args = { slug: "example", asset: new Uint8Array([1, 2, 3]) };
        const parsed = field.parse(path, args);

        expect(field.reader.parse(path)).toBe(path);
        expect(field.serialize(field.validate(parsed), args).value).toBe(path);
      }
    }
  });
});
