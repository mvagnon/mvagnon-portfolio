"use client";

import InfiniteGallery, {
  type ImageItem,
  type InfiniteGalleryProps,
} from "@/components/ui/3d-gallery-photography";

type ProjectGalleryProps = {
  images: ImageItem[];
  className?: string;
} & Pick<
  InfiniteGalleryProps,
  "falloff" | "speed" | "visibleCount" | "zSpacing"
>;

export function ProjectGallery({
  images,
  className,
  falloff,
  speed,
  visibleCount,
  zSpacing,
}: ProjectGalleryProps) {
  return (
    <InfiniteGallery
      images={images}
      speed={speed}
      zSpacing={zSpacing}
      visibleCount={visibleCount}
      falloff={falloff}
      className={className ?? "h-full w-full"}
    />
  );
}
