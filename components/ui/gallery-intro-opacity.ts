export function advanceIntroOpacity(
  currentOpacity: number,
  delta: number,
  duration: number,
) {
  if (duration <= 0) {
    return 1;
  }

  const safeCurrentOpacity = Math.min(Math.max(currentOpacity, 0), 1);
  const safeDelta = Math.max(delta, 0);
  const nextOpacity = safeCurrentOpacity + safeDelta / duration;

  return Math.min(Math.max(nextOpacity, 0), 1);
}

export function getStaggeredIntroOpacity(
  elapsed: number,
  index: number,
  duration: number,
  staggerDelay: number,
) {
  if (duration <= 0) {
    return 1;
  }

  const safeElapsed = Math.max(elapsed, 0);
  const safeIndex = Math.max(Math.floor(index), 0);
  const safeStaggerDelay = Math.max(staggerDelay, 0);
  const itemElapsed = safeElapsed - safeIndex * safeStaggerDelay;

  return Math.min(Math.max(itemElapsed / duration, 0), 1);
}
