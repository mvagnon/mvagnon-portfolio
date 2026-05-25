import { createReader } from "@keystatic/core/reader";

import keystaticConfig from "@/keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

const profileLinkIcons = ["github", "link"] as const;

export type ProfileLinkIcon = (typeof profileLinkIcons)[number];

export type ProfileLink = {
  id: string;
  title: string;
  order: number;
  url: string;
  icon: ProfileLinkIcon;
};

export async function getProfileLinks(): Promise<ProfileLink[]> {
  const profileLinks = await reader.collections.profileLinks.all();

  return profileLinks
    .map(({ slug, entry }) => ({
      id: slug,
      title: entry.title,
      order: entry.order,
      url: entry.url,
      icon: normalizeProfileLinkIcon(entry.icon),
    }))
    .sort(
      (a, b) =>
        a.order - b.order ||
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" }),
    );
}

function normalizeProfileLinkIcon(icon: string): ProfileLinkIcon {
  return profileLinkIcons.includes(icon as ProfileLinkIcon)
    ? (icon as ProfileLinkIcon)
    : "link";
}
