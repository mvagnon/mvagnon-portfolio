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
