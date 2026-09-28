"use client";

import { useTexture } from "@react-three/drei";
import { getImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SRGBColorSpace, VideoTexture, type Texture } from "three";

import { isVideoSrc } from "@/lib/media";

/** Loads image and video textures in gallery order and releases video resources. */
export function useGalleryTextures(sources: string[]): (Texture | undefined)[] {
  const imageSources = useMemo(
    () => sources.filter((src) => !isVideoSrc(src)),
    [sources],
  );
  const videoSources = useMemo(
    () => [...new Set(sources.filter(isVideoSrc))],
    [sources],
  );
  const optimizedSources = useMemo(
    () => imageSources.map(getOptimizedTextureSrc),
    [imageSources],
  );
  const images = useTexture(optimizedSources);
  const [videos, setVideos] = useState<Map<string, VideoTexture>>(new Map());

  useEffect(() => {
    const textures = new Map<string, VideoTexture>();
    const loadedTextures = new Map<string, VideoTexture>();

    for (const src of videoSources) {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.src = src;

      const texture = new VideoTexture(video);
      texture.colorSpace = SRGBColorSpace;
      textures.set(src, texture);
      video.onloadeddata = () => {
        loadedTextures.set(src, texture);
        setVideos(new Map(loadedTextures));
      };
      void video.play().catch(() => video.pause());
    }

    return () => {
      for (const texture of textures.values()) {
        const video = texture.image as HTMLVideoElement;
        video.onloadeddata = null;
        video.pause();
        texture.dispose();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [videoSources]);

  const textures = new Map<string, Texture>(videos);
  imageSources.forEach((src, index) => textures.set(src, images[index]));

  return sources.map((src) => textures.get(src));
}

function getOptimizedTextureSrc(src: string): string {
  const pathname = src.split("?")[0]?.toLowerCase();

  if (
    !src.startsWith("/") ||
    src.startsWith("//") ||
    pathname?.endsWith(".svg")
  ) {
    return src;
  }

  const { props } = getImageProps({
    src,
    alt: "",
    width: 1920,
    height: 1080,
    quality: 100,
  });

  return props.src;
}
