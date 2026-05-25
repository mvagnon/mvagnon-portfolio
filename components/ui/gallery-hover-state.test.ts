import { describe, expect, test } from "bun:test";

import {
  clearGalleryHoverState,
  updateGalleryHoverState,
} from "./gallery-hover-state";

describe("updateGalleryHoverState", () => {
  test("keeps the gallery hovered while at least one plane is hovered", () => {
    const hoveredPlaneIndexes = new Set<number>();

    expect(updateGalleryHoverState(hoveredPlaneIndexes, 1, true)).toEqual({
      active: true,
      changed: true,
    });
    expect(updateGalleryHoverState(hoveredPlaneIndexes, 2, true)).toEqual({
      active: true,
      changed: false,
    });
    expect(updateGalleryHoverState(hoveredPlaneIndexes, 1, false)).toEqual({
      active: true,
      changed: false,
    });
    expect(updateGalleryHoverState(hoveredPlaneIndexes, 2, false)).toEqual({
      active: false,
      changed: true,
    });
  });

  test("clears every hovered plane at once", () => {
    const hoveredPlaneIndexes = new Set([1, 2]);

    expect(clearGalleryHoverState(hoveredPlaneIndexes)).toEqual({
      active: false,
      changed: true,
    });
    expect(hoveredPlaneIndexes.size).toBe(0);
  });
});
