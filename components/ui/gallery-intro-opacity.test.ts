import { describe, expect, test } from "bun:test";

import { advanceIntroOpacity } from "./gallery-intro-opacity";

describe("advanceIntroOpacity", () => {
  test("progresses from hidden to visible over the configured duration", () => {
    expect(advanceIntroOpacity(0, 0, 0.5)).toBe(0);
    expect(advanceIntroOpacity(0, 0.25, 0.5)).toBe(0.5);
    expect(advanceIntroOpacity(0.5, 0.25, 0.5)).toBe(1);
  });

  test("stays clamped between hidden and visible", () => {
    expect(advanceIntroOpacity(-0.2, -0.1, 0.5)).toBe(0);
    expect(advanceIntroOpacity(0.9, 1, 0.5)).toBe(1);
  });
});
