import { describe, expect, test } from "bun:test";

import { getProfileUrl } from "@/lib/profile.ts";

describe("profile transforms", () => {
  test("builds the featured profile URL only when title and URL are set", () => {
    expect(
      getProfileUrl({
        titleUrl: "Book a call",
        url: "https://example.com",
      }),
    ).toEqual({
      title: "Book a call",
      url: "https://example.com",
    });

    expect(getProfileUrl({ titleUrl: "Book a call" })).toBeUndefined();
    expect(getProfileUrl({ url: "https://example.com" })).toBeUndefined();
    expect(getProfileUrl({ titleUrl: "", url: "https://example.com" }))
      .toBeUndefined();
  });
});
