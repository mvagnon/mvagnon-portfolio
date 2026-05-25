import { config, fields, collection } from "@keystatic/core";

const projectColors = ["#000000", "#1F150C", "#412D15", "#E1DCC9"] as const;

function getRandomProjectColor() {
  return projectColors[Math.floor(Math.random() * projectColors.length)];
}

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
        color: fields.text({
          label: "Color",
          description: "Generated automatically for project backgrounds.",
          defaultValue: getRandomProjectColor,
          validation: {
            isRequired: true,
            pattern: {
              regex: /^#[0-9a-fA-F]{6}$/,
              message: "Use a hex color like #000000.",
            },
          },
        }),
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
    profile: collection({
      label: "Profile",
      slugField: "name",
      path: "content/profile/*",
      columns: ["name"],
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
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
