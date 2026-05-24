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
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.markdoc({ label: "Content" }),
      },
    }),
  },
});
