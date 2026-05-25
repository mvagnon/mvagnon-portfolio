import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "content/projects/*",
      columns: ["title"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        coverImage: fields.image({
          label: "Cover image",
          directory: "public/images/projects",
          publicPath: "/images/projects/",
          validation: { isRequired: true },
        }),
        github: fields.url({
          label: "GitHub",
          description: "Optional repository URL.",
        }),
        url: fields.url({
          label: "Production URL",
          description: "Optional live project URL.",
        }),
        images: fields.array(
          fields.image({
            label: "Image",
            directory: "public/images/projects",
            publicPath: "/images/projects/",
            validation: { isRequired: true },
          }),
          {
            label: "Images",
            validation: {
              length: { min: 1 },
            },
          },
        ),
      },
    }),
  },
});
