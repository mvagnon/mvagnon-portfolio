type GalleryHoverUpdate = {
  active: boolean;
  changed: boolean;
};

export function updateGalleryHoverState(
  hoveredPlaneIndexes: Set<number>,
  planeIndex: number,
  isHovered: boolean,
): GalleryHoverUpdate {
  const wasActive = hoveredPlaneIndexes.size > 0;

  if (isHovered) {
    hoveredPlaneIndexes.add(planeIndex);
  } else {
    hoveredPlaneIndexes.delete(planeIndex);
  }

  const active = hoveredPlaneIndexes.size > 0;

  return {
    active,
    changed: active !== wasActive,
  };
}

export function clearGalleryHoverState(
  hoveredPlaneIndexes: Set<number>,
): GalleryHoverUpdate {
  const changed = hoveredPlaneIndexes.size > 0;

  hoveredPlaneIndexes.clear();

  return {
    active: false,
    changed,
  };
}
