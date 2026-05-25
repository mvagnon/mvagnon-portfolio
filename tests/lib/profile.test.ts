import { describe, expect, test } from "bun:test";

import { getProfile } from "@/lib/profile";

describe("getProfile", () => {
  test("returns the configured profile with links sorted by display order", async () => {
    const profile = await getProfile();

    expect(profile).toEqual({
      title: "Matthieu Vagnon's Portfolio",
      description:
        "I'm Matthieu Vagnon, a full-stack developer and software architect. I craft premium digital experiences with obsessive attention to detail, from solid architecture to the final polished interaction.",
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
