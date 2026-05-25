import { describe, expect, test } from "bun:test";

import { getProfileLinks } from "./profile-links";

describe("getProfileLinks", () => {
  test("returns configured profile links sorted by display order", async () => {
    const profileLinks = await getProfileLinks();

    expect(profileLinks).toEqual([
      {
        id: "github",
        title: "GitHub",
        order: 1,
        url: "https://github.com/mvagnon",
        icon: "github",
      },
      {
        id: "linkedin",
        title: "LinkedIn",
        order: 2,
        url: "https://fr.linkedin.com/in/matthieu-vagnon",
        icon: "link",
      },
      {
        id: "malt",
        title: "Malt",
        order: 3,
        url: "https://www.malt.fr/profile/matthieuvagnon1",
        icon: "link",
      },
    ]);
  });
});
