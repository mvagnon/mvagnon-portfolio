import { describe, expect, test } from "bun:test";

import { getProfile } from "./profile";

describe("getProfile", () => {
  test("returns the configured profile with links sorted by display order", async () => {
    const profile = await getProfile();

    expect(profile).toEqual({
      id: "matthieu-vagnon",
      name: "Matthieu Vagnon",
      description:
        "Je m'appelle Matthieu Vagnon, développeur full-stack et architecte logiciel. Dans mes projets, je recherche la perfection: je ne livre que des expériences premium, soignées et léchées.",
      links: [
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
          icon: "linkedin",
        },
        {
          id: "malt",
          title: "Malt",
          order: 3,
          url: "https://www.malt.fr/profile/matthieuvagnon1",
          icon: "malt",
        },
      ],
    });
  });
});
