import { createReader } from "@keystatic/core/reader";

import keystaticConfig from "@/keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

const profileLinkIcons = ["github", "linkedin", "malt", "link"] as const;

export type ProfileLinkIcon = (typeof profileLinkIcons)[number];

export type ProfileLink = {
  id: string;
  title: string;
  order: number;
  url: string;
  icon: ProfileLinkIcon;
};

export type Profile = {
  id: string;
  name: string;
  description: string;
  links: ProfileLink[];
};

export async function getProfile(): Promise<Profile> {
  const profiles = await reader.collections.profile.all();
  const profile = profiles
    .toSorted((a, b) =>
      a.entry.name.localeCompare(b.entry.name, "fr", { sensitivity: "base" }),
    )
    .at(0);

  if (!profile) {
    throw new Error("Profile content is missing.");
  }

  return {
    id: profile.slug,
    name: profile.entry.name,
    description: profile.entry.description,
    links: profile.entry.links
      .map((link) => ({
        id: toProfileLinkId(link.title),
        title: link.title,
        order: link.order,
        url: link.url,
        icon: normalizeProfileLinkIcon(link.icon),
      }))
      .toSorted(
        (a, b) =>
          a.order - b.order ||
          a.title.localeCompare(b.title, "fr", { sensitivity: "base" }),
      ),
  };
}

function normalizeProfileLinkIcon(icon: string): ProfileLinkIcon {
  return profileLinkIcons.includes(icon as ProfileLinkIcon)
    ? (icon as ProfileLinkIcon)
    : "link";
}

function toProfileLinkId(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "link"
  );
}
