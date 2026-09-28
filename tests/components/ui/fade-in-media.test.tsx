import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ImageConfigContext } from "next/dist/shared/lib/image-config-context.shared-runtime";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

import { FadeInMedia } from "@/components/ui/fade-in-media";
import { FramerCarousel } from "@/components/ui/framer-carousel";
import { isVideoSrc } from "@/lib/media";
import nextConfig from "@/next.config";

describe("project media", () => {
  test("recognizes video extensions without mistaking image query strings for videos", () => {
    for (const src of [
      "/cover.mp4",
      "/cover.WEBM?v=1",
      "/clip.ogv#t=2",
      "/clip.mov",
      "/clip.m4v",
    ]) {
      expect(isVideoSrc(src)).toBe(true);
    }
    for (const src of [
      "/cover.gif",
      "/cover.png?name=clip.mp4",
      "/clip.mp4.png",
    ]) {
      expect(isVideoSrc(src)).toBe(false);
    }
  });

  test("plays cover videos silently in a loop without player controls", () => {
    const html = renderToStaticMarkup(
      <FadeInMedia
        src="/cover.mp4"
        alt="Project demo"
        fill
        className="object-cover"
      />,
    );

    expect(html).toContain("<video");
    expect(html).toContain('src="/cover.mp4"');
    for (const attribute of ["autoPlay", "loop", "muted", "playsInline"]) {
      expect(html.toLowerCase()).toContain(`${attribute.toLowerCase()}=""`);
    }
    expect(html).not.toContain("controls=");
    expect(html).not.toContain("<img");
    expect(html).toContain("absolute inset-0 h-full w-full");
    expect(html).toContain("object-cover");
    expect(html).toContain('aria-label="Project demo"');
  });

  test("renders mixed images, GIFs and videos in the fullscreen carousel", () => {
    const html = renderToStaticMarkup(
      <ImageConfigContext.Provider value={{ ...imageConfigDefault, ...nextConfig.images }}>
        <FramerCarousel images={[
          { src: "/cover.png" },
          { src: "/animation.gif" },
          { src: "/demo.webm" },
        ]} />
      </ImageConfigContext.Provider>,
    );

    expect(html).toContain("<img");
    expect(html).toContain("%2Fanimation.gif");
    expect(html).toContain('<video src="/demo.webm"');
    expect(html).not.toContain("controls=");
  });
});
