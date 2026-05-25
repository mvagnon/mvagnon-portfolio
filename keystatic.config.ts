import { collection, config, fields, singleton } from "@keystatic/core";

import { projectImagesField } from "@/lib/keystatic/project-images-field";

export default config({
  storage: {
    kind: "cloud",
  },
  cloud: {
    project: "matthieu-vagnon/mvagnon-portfolio",
  },
  collections: {
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "content/projects/*",
      columns: ["title", "createdAt"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        createdAt: fields.datetime({
          label: "Created at",
          defaultValue: { kind: "now" },
          validation: {
            isRequired: true,
          },
        }),
        order: fields.ignored(),
        color: fields.ignored(),
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
        images: projectImagesField({
          label: "Images",
          directory: "public/images/projects",
          publicPath: "/images/projects/",
          validation: {
            length: { min: 1 },
          },
        }),
      },
    }),
  },
  singletons: {
    profile: singleton({
      label: "Profile",
      path: "content/profile/matthieu-vagnon",
      schema: {
        title: fields.text({
          label: "Page title",
          validation: {
            isRequired: true,
          },
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: {
            isRequired: true,
          },
        }),
        links: fields.array(
          fields.object({
            title: fields.text({
              label: "Title",
              validation: {
                isRequired: true,
              },
            }),
            order: fields.integer({
              label: "Display order",
              defaultValue: 1,
              validation: {
                isRequired: true,
                min: 1,
              },
            }),
            url: fields.url({
              label: "URL",
              validation: {
                isRequired: true,
              },
            }),
            icon: fields.select({
              label: "Icon",
              description:
                "Use Link until dedicated platform icons are available.",
              options: [
                { label: "GitHub", value: "github" },
                { label: "LinkedIn", value: "linkedin" },
                { label: "Malt", value: "malt" },
                { label: "Link", value: "link" },
              ],
              defaultValue: "link",
            }),
          }),
          {
            label: "Links",
          },
        ),
      },
    }),
  },
});
