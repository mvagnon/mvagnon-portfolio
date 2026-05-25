import { describe, expect, test } from "bun:test";

import { projectImagesField } from "@/lib/keystatic/project-images-field";

const field = projectImagesField({
  label: "Images",
  directory: "public/images/projects",
  publicPath: "/images/projects/",
  validation: {
    length: { min: 1 },
  },
});

describe("projectImagesField", () => {
  test("reads project image paths as the public URL array used by the site", () => {
    expect(
      field.reader.parse([
        "/images/projects/demo/images/0.png",
        "/images/projects/demo/images/1.jpg",
      ]),
    ).toEqual([
      "/images/projects/demo/images/0.png",
      "/images/projects/demo/images/1.jpg",
    ]);
  });

  test("parses stored image paths with their matching external asset files", () => {
    const firstImage = new Uint8Array([1, 2, 3]);
    const secondImage = new Uint8Array([4, 5, 6]);

    expect(
      field.parse(
        [
          "/images/projects/demo/images/0.png",
          "/images/projects/demo/images/1.jpeg",
        ],
        {
          slug: "demo",
          other: new Map(),
          external: new Map([
            [
              "public/images/projects",
              new Map([
                ["images/0.png", firstImage],
                ["images/1.jpeg", secondImage],
              ]),
            ],
          ]),
        },
      ),
    ).toEqual([
      {
        data: firstImage,
        extension: "png",
        filename: "images/0.png",
        src: "/images/projects/demo/images/0.png",
      },
      {
        data: secondImage,
        extension: "jpeg",
        filename: "images/1.jpeg",
        src: "/images/projects/demo/images/1.jpeg",
      },
    ]);
  });

  test("serializes multiple images into indexed public paths and external files", () => {
    const firstImage = new Uint8Array([1, 2, 3]);
    const secondImage = new Uint8Array([4, 5, 6]);

    const serialized = field.serialize(
      [
        {
          data: firstImage,
          extension: "png",
          filename: "anything.png",
          src: "",
        },
        {
          data: secondImage,
          extension: "JPEG",
          filename: "anything.jpeg",
          src: "",
        },
      ],
      { slug: "demo" },
    );

    expect(serialized.value).toEqual([
      "/images/projects/demo/images/0.png",
      "/images/projects/demo/images/1.jpeg",
    ]);
    expect(serialized.other).toEqual(new Map());
    expect(serialized.external.get("public/images/projects")).toEqual(
      new Map([
        ["images/0.png", firstImage],
        ["images/1.jpeg", secondImage],
      ]),
    );
  });

  test("rejects an empty required gallery", () => {
    expect(() => field.validate([])).toThrow(
      "Images must contain at least 1 image.",
    );
  });
});
