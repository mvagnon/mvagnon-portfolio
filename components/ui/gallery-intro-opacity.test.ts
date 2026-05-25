import { describe, expect, test } from "bun:test";

import {
  advanceIntroOpacity,
  getStaggeredIntroOpacity,
} from "./gallery-intro-opacity";

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

describe("getStaggeredIntroOpacity", () => {
  test("delays each following item by the configured stagger", () => {
    expect(getStaggeredIntroOpacity(0.2, 0, 0.4, 0.1)).toBe(0.5);
    expect(getStaggeredIntroOpacity(0.2, 1, 0.4, 0.1)).toBe(0.25);
    expect(getStaggeredIntroOpacity(0.2, 2, 0.4, 0.1)).toBe(0);
  });

  test("clamps opacity once each item has finished fading in", () => {
    expect(getStaggeredIntroOpacity(2, 3, 0.4, 0.1)).toBe(1);
  });
});
