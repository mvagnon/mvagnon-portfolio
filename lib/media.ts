/** Identifies browser-playable video paths, including URLs with query strings. */
export function isVideoSrc(src: string): boolean {
  return /\.(mp4|webm|ogv|ogg|mov|m4v)$/i.test(src.split(/[?#]/)[0]);
}
