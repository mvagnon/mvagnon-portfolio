import { collection, config, fields, singleton } from "@keystatic/core";

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
      columns: ["title", "client", "date"],
      sortBy: {
        field: "date",
        direction: "descending",
      },
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            validation: {
              isRequired: true,
            },
          },
        }),
        client: fields.text({
          label: "Client",
        }),
        date: fields.datetime({
          label: "Date",
        }),
        createdAt: fields.ignored(),
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
        url: fields.url({
          label: "URL",
          description: "Optional featured profile URL.",
        }),
        titleUrl: fields.text({
          label: "Title URL",
          description: "Label displayed for the featured profile URL.",
        }),
        links: fields.array(
          fields.object({
            title: fields.text({
              label: "Title",
              validation: {
                isRequired: true,
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
                { label: "Coffee", value: "coffee" },
                { label: "GitHub", value: "github" },
                { label: "LinkedIn", value: "linkedin" },
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
