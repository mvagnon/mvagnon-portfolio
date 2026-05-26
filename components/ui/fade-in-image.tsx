"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function FadeInImage({
  alt,
  className,
  onLoad,
  src,
  ...props
}: ImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const image = imageRef.current;

    setIsLoaded(Boolean(image?.complete && image.naturalWidth > 0));
  }, [src]);

  return (
    <Image
      {...props}
      alt={alt}
      ref={imageRef}
      src={src}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
      className={cn(
        className,
        "transition-opacity duration-500 ease-out",
        isLoaded ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
