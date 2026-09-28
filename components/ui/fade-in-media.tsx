"use client";

import type { ImageProps } from "next/image";
import { useState } from "react";

import { FadeInImage } from "@/components/ui/fade-in-image";
import { isVideoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

/** Displays images or silent looping videos with the same layout and fade-in. */
export function FadeInMedia(props: ImageProps) {
  if (typeof props.src === "string" && isVideoSrc(props.src)) {
    return <LoopingVideo key={props.src} {...props} src={props.src} />;
  }

  return <FadeInImage {...props} />;
}

function LoopingVideo({
  src,
  alt,
  className,
  fill,
  width,
  height,
  style,
  draggable,
}: ImageProps & { src: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <video
      src={src}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      autoPlay
      loop
      muted
      playsInline
      controls={false}
      disablePictureInPicture
      width={width}
      height={height}
      draggable={draggable}
      style={style}
      onLoadedData={() => setIsLoaded(true)}
      className={cn(
        fill && "absolute inset-0 h-full w-full",
        className,
        "transition-opacity duration-500 ease-out",
        isLoaded ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
